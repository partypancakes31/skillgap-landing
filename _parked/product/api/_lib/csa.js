/**
 * CSA — Composite Skill Assessment scoring utilities
 *
 * Accuracy   (60% weight): percentage of questions answered correctly
 * Speed      (20% weight): time efficiency — finishing faster scores higher
 * Stability  (20% weight): consistency of performance across early/mid/late thirds
 * Skill Index: weighted composite of all three dimensions
 */

/**
 * @param {Record<string, string>} answers   { questionId: selectedOption }
 * @param {Array<{id: string, correctAnswer: string, points?: number}>} questions
 * @returns {number} 0–100 (weighted by question points — Easy=1, Medium=2, Hard=3)
 */
function computeAccuracy(answers, questions) {
  if (!questions.length) return 0
  const totalPoints  = questions.reduce((sum, q) => sum + (q.points ?? 1), 0)
  const earnedPoints = questions.reduce((sum, q) =>
    sum + (answers[q.id] === q.correctAnswer ? (q.points ?? 1) : 0), 0)
  return Math.round((earnedPoints / totalPoints) * 100)
}

/**
 * @param {number} timeTakenMs      milliseconds the student actually used
 * @param {number} totalAllottedMs  total allotted milliseconds (e.g. 30 * 60 * 1000)
 * @returns {number} 0–100 — full allotment used = 0, instant = 100
 */
function computeSpeed(timeTakenMs, totalAllottedMs) {
  if (totalAllottedMs <= 0) return 0
  const ratio = Math.min(timeTakenMs / totalAllottedMs, 1)
  return Math.round((1 - ratio) * 100)
}

/**
 * Measures how consistently the student performed across the three equal
 * segments (early, middle, late) of the assessment.
 *
 * Formula: 100 − (max_segment_accuracy − min_segment_accuracy)
 * Perfect consistency → 100; wildly erratic → approaches 0.
 *
 * @param {Array<{id: string, correctAnswer: string}>} questions  ordered question list
 * @param {Record<string, string>} answers  { questionId: selectedOption }
 * @returns {number} 0–100
 */
function computeStability(questions, answers) {
  if (questions.length < 3) return 100

  const size = Math.ceil(questions.length / 3)
  const segments = [
    questions.slice(0, size),
    questions.slice(size, size * 2),
    questions.slice(size * 2),
  ]

  const segAccuracies = segments.map(seg => {
    if (!seg.length) return 0
    const correct = seg.filter(q => answers[q.id] === q.correctAnswer).length
    return (correct / seg.length) * 100
  })

  const range = Math.max(...segAccuracies) - Math.min(...segAccuracies)
  return Math.round(Math.max(0, 100 - range))
}

/**
 * @param {number} accuracy   0–100
 * @param {number} speed      0–100
 * @param {number} stability  0–100
 * @returns {number} 0–100 weighted composite
 */
function computeSkillIndex(accuracy, speed, stability) {
  return Math.round(accuracy * 0.60 + speed * 0.20 + stability * 0.20)
}

/**
 * @param {number} score 0–100
 * @returns {'Proficient' | 'Developing' | 'Gap'}
 */
function classifyProficiency(score) {
  if (score >= 75) return 'Proficient'
  if (score >= 50) return 'Developing'
  return 'Gap'
}

/**
 * Compact digest of incorrectly answered questions for AI FOCUS prompts.
 * @param {Array<{id, text, options, correctAnswer}>} questions
 * @param {Record<string, string>} answers  { questionId: 'A'|'B'|'C'|'D' }
 * @param {number} [max=8]
 * @returns {string}
 */
function extractWrongAnswerDigest(questions, answers, max = 8) {
  if (!questions?.length || !answers) return ''
  const wrong = questions.filter(q => {
    const given = answers[q.id]
    return given != null && given !== q.correctAnswer
  })
  if (wrong.length === 0) return ''

  const lines = wrong.slice(0, max).map(q => {
    const givenKey     = answers[q.id]
    const givenText    = q.options?.[givenKey]        ?? givenKey
    const correctText  = q.options?.[q.correctAnswer] ?? q.correctAnswer
    const concept      = q.text.length > 70  ? q.text.slice(0, 67)   + '…' : q.text
    const givenShort   = givenText.length > 50  ? givenText.slice(0, 47)   + '…' : givenText
    const correctShort = correctText.length > 50 ? correctText.slice(0, 47) + '…' : correctText
    return `• ${concept}: chose "${givenShort}" → correct: ${q.correctAnswer} "${correctShort}"`
  })

  return `Wrong answers (${wrong.length} of ${questions.length}):\n` + lines.join('\n')
}

/**
 * Compact digest of correctly answered questions for AI STRENGTHS prompts.
 * @param {Array<{id, text, options, correctAnswer}>} questions
 * @param {Record<string, string>} answers
 * @param {number} [max=4]
 * @returns {string}
 */
function extractCorrectAnswerDigest(questions, answers, max = 4) {
  if (!questions?.length || !answers) return ''
  const correct = questions.filter(q => answers[q.id] === q.correctAnswer)
  if (correct.length === 0) return ''

  const lines = correct.slice(0, max).map(q => {
    const correctText  = q.options?.[q.correctAnswer] ?? q.correctAnswer
    const concept      = q.text.length > 70  ? q.text.slice(0, 67)   + '…' : q.text
    const correctShort = correctText.length > 50 ? correctText.slice(0, 47) + '…' : correctText
    return `• ${concept}: correctly chose ${q.correctAnswer} "${correctShort}"`
  })

  return `Correct answers (${correct.length} of ${questions.length}, showing ${Math.min(correct.length, max)}):\n` + lines.join('\n')
}

/**
 * Compute class-level insights across all student results.
 * @param {Array<{summary: object, answers: object, questionId?: string}>} studentResults
 * @param {Array<{id: string}>} questions
 * @returns {object}
 */
function computeClassInsights(studentResults, questions) {
  if (!studentResults.length) return null

  const scores = studentResults.map(r => r.summary.compositeScore)
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

  const distribution = { Proficient: 0, Developing: 0, Gap: 0 }
  studentResults.forEach(r => { distribution[r.summary.performanceBand]++ })

  const avgAccuracy  = Math.round(studentResults.reduce((s, r) => s + r.summary.accuracy,  0) / studentResults.length)
  const avgSpeed     = Math.round(studentResults.reduce((s, r) => s + r.summary.speed,     0) / studentResults.length)
  const avgStability = Math.round(studentResults.reduce((s, r) => s + r.summary.stability, 0) / studentResults.length)

  // Find questions with highest incorrect rates
  const incorrectCounts = {}
  studentResults.forEach(({ answers }) => {
    questions.forEach(q => {
      if (answers[q.id] != null && answers[q.id] !== q.correctAnswer) {
        incorrectCounts[q.id] = (incorrectCounts[q.id] ?? 0) + 1
      }
    })
  })

  const total = studentResults.length
  const weakestQuestions = Object.entries(incorrectCounts)
    .map(([questionId, count]) => ({ questionId, incorrectRate: Math.round((count / total) * 100) / 100 }))
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 5)

  return { averageScore, distribution, averageAccuracy: avgAccuracy, averageSpeed: avgSpeed, averageStability: avgStability, weakestQuestions }
}

module.exports = {
  computeAccuracy,
  computeSpeed,
  computeStability,
  computeSkillIndex,
  classifyProficiency,
  extractWrongAnswerDigest,
  extractCorrectAnswerDigest,
  computeClassInsights,
}
