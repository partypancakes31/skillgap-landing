const {
  computeAccuracy,
  computeSpeed,
  computeStability,
  computeSkillIndex,
  classifyProficiency,
  extractWrongAnswerDigest,
  extractCorrectAnswerDigest,
  computeClassInsights,
} = require('./_lib/csa')

const { generateFeedback, generateDeepReport, parseDeepReport } = require('./_lib/ai')

const CONCURRENCY = 5  // max parallel AI calls per batch

// Run an array of async tasks with a max concurrency cap
async function withConcurrency(tasks, limit) {
  const results = []
  let i = 0
  async function run() {
    while (i < tasks.length) {
      const idx = i++
      results[idx] = await tasks[idx]()
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, run))
  return results
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // ── Parse + validate ────────────────────────────────────────────────────────
  const { subject = '', topic, questions, responses, settings = {} } = req.body || {}

  if (!topic?.id || !topic?.label)
    return res.status(400).json({ error: 'topic.id and topic.label are required' })
  if (!Array.isArray(questions) || questions.length === 0)
    return res.status(400).json({ error: 'questions array is required and must not be empty' })
  if (!Array.isArray(responses) || responses.length === 0)
    return res.status(400).json({ error: 'responses array is required and must not be empty' })

  for (const q of questions) {
    if (!q.id || !q.correctAnswer)
      return res.status(400).json({ error: `Each question must have id and correctAnswer. Missing on: ${q.id ?? '(no id)'}` })
  }
  for (const r of responses) {
    if (!r.studentId || typeof r.answers !== 'object')
      return res.status(400).json({ error: `Each response must have studentId and answers. Missing on: ${r.studentId ?? '(no studentId)'}` })
  }

  const {
    allottedMs         = 30 * 60 * 1000,
    aiFeedbackEnabled  = false,
    feedbackStyle      = 'concise',
    priorExperience    = 'beginner',
    learningGoals      = '',
  } = settings

  // ── Score each student ──────────────────────────────────────────────────────
  const scored = responses.map(({ studentId, answers, timeTakenMs = allottedMs, previousScore = null }) => {
    const accuracy    = computeAccuracy(answers, questions)
    const speed       = computeSpeed(timeTakenMs, allottedMs)
    const stability   = computeStability(questions, answers)
    const skillIndex  = computeSkillIndex(accuracy, speed, stability)
    const band        = classifyProficiency(skillIndex)
    const correctCount  = questions.filter(q => answers[q.id] === q.correctAnswer).length
    const totalPoints   = questions.reduce((s, q) => s + (q.points ?? 1), 0)
    const earnedPoints  = questions.reduce((s, q) => s + (answers[q.id] === q.correctAnswer ? (q.points ?? 1) : 0), 0)
    const wrongAnswerDigest   = extractWrongAnswerDigest(questions, answers)
    const correctAnswerDigest = extractCorrectAnswerDigest(questions, answers)

    return {
      studentId,
      answers,
      previousScore,
      summary: {
        compositeScore:  skillIndex,
        performanceBand: band,
        accuracy,
        speed,
        stability,
        totalQuestions:  questions.length,
        correctCount,
        earnedPoints,
        totalPoints,
      },
      wrongAnswerDigest,
      correctAnswerDigest,
      aiFeedback:    null,
      aiDeepReport:  null,
    }
  })

  // ── AI feedback (optional, concurrency-capped) ──────────────────────────────
  if (aiFeedbackEnabled) {
    const aiTasks = scored.map(student => async () => {
      const { summary, wrongAnswerDigest, correctAnswerDigest, previousScore } = student
      const sharedArgs = {
        subject,
        topicLabel:        topic.label,
        accuracy:          summary.accuracy,
        speed:             summary.speed,
        stability:         summary.stability,
        skillIndex:        summary.compositeScore,
        performanceBand:   summary.performanceBand,
        totalQuestions:    summary.totalQuestions,
        correctCount:      summary.correctCount,
        wrongAnswerDigest,
        correctAnswerDigest,
      }

      const [feedback, deepReportRaw] = await Promise.all([
        generateFeedback(sharedArgs),
        generateDeepReport({ ...sharedArgs, priorExperience, learningGoals, feedbackStyle, previousScore }),
      ])

      student.aiFeedback   = feedback
      student.aiDeepReport = parseDeepReport(deepReportRaw)
    })

    await withConcurrency(aiTasks, CONCURRENCY)
  }

  // ── Strip internal fields before response ───────────────────────────────────
  const results = scored.map(({ answers: _a, previousScore: _p, ...rest }) => rest)

  // ── Class insights ──────────────────────────────────────────────────────────
  const classInsights = computeClassInsights(scored, questions)

  return res.status(200).json({ results, classInsights })
}
