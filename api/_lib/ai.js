/**
 * AI feedback utilities for the GapLee analyze endpoint.
 * Calls DeepSeek directly using DEEPSEEK_API_KEY from server environment.
 * No browser env vars, no proxy — this runs server-side only.
 */

async function callAI(prompt, max_tokens = 160, temperature = 0.7) {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) return null

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model:    'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens,
        temperature,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

function fallbackFeedback(performanceBand, topicLabel) {
  if (performanceBand === 'Proficient')
    return `Great work on ${topicLabel}! Your score reflects strong command of the material. Keep reinforcing edge cases to maintain this level.`
  if (performanceBand === 'Developing')
    return `You have a solid foundation in ${topicLabel} but there are gaps worth addressing. Focus on the areas where you hesitated and review the underlying concepts.`
  return `Your ${topicLabel} score indicates significant gaps. Prioritise revisiting core concepts and practice with targeted exercises before retaking this assessment.`
}

function fallbackDeepReport(band, topic) {
  const accuracyAdj = band === 'Proficient' ? 'strong' : band === 'Developing' ? 'moderate' : 'limited'
  return `---BREAKDOWN---
Your accuracy is ${accuracyAdj} for this ${topic} assessment and your pace was steady overall. Take note of the questions that slowed you down most — those topics are your best starting point for improvement.

---STRENGTHS---
• Completed a full ${topic} assessment from start to finish
• Showed consistent engagement across all questions

---FOCUS---
• Go back and identify the specific concepts behind each incorrect answer
• Build depth before breadth — understand the ${topic} basics thoroughly

---PLAN---
Start with the available learning resources and work through each area one step at a time. Focus on truly understanding each concept before moving to the next.

---STEPS---
1. Revisit each incorrect answer and understand exactly why it was wrong
2. Find one beginner-friendly resource for your weakest concept and study it
3. Retake the assessment once you feel confident in those areas`
}

// ─── Short feedback ───────────────────────────────────────────────────────────

async function generateFeedback({
  subject             = '',
  topicLabel,
  accuracy,
  speed,
  stability,
  skillIndex,
  performanceBand,
  totalQuestions,
  correctCount,
  wrongAnswerDigest   = '',
  correctAnswerDigest = '',
}) {
  const subjectName = subject || 'the subject'
  const hasWrong    = wrongAnswerDigest.length > 0
  const hasCorrect  = correctAnswerDigest.length > 0

  const prompt = `You are a ${subjectName} tutor. A student just completed a skill-gap assessment.

ASSESSMENT:
Topic: ${topicLabel}
Band: ${performanceBand} (Skill Index ${skillIndex}/100)
Accuracy: ${correctCount} of ${totalQuestions} correct
Speed: ${speed}/100 | Stability: ${stability != null ? `${stability}/100` : 'N/A'}
${hasCorrect ? `\n${correctAnswerDigest}\n` : ''}${hasWrong ? `\n${wrongAnswerDigest}\n` : ''}
Write 2–3 sentences of direct, specific feedback. ${hasWrong ? 'Name at least one specific concept from the wrong answers above and explain the correct understanding in plain terms.' : 'Speak about their performance qualitatively.'} ${hasCorrect ? 'Briefly acknowledge a concept they clearly understand.' : ''} If stability is below 60, mention consistency. No bullet points, no headers, no score numbers. Be honest but encouraging.`

  try {
    const text = await callAI(prompt, 280, 0.7)
    return text || fallbackFeedback(performanceBand, topicLabel)
  } catch {
    return fallbackFeedback(performanceBand, topicLabel)
  }
}

// ─── Deep report ─────────────────────────────────────────────────────────────

async function generateDeepReport({
  subject             = '',
  topicLabel,
  accuracy,
  speed,
  stability,
  skillIndex,
  performanceBand,
  totalQuestions,
  correctCount,
  priorExperience     = 'beginner',
  learningGoals       = '',
  feedbackStyle       = 'concise',
  wrongAnswerDigest   = '',
  correctAnswerDigest = '',
  previousScore       = null,
}) {
  const subjectName = subject || 'the subject'
  const experienceLabel = {
    beginner:     `a beginner who is new to ${subjectName}`,
    intermediate: `an intermediate learner with some ${subjectName} experience`,
    advanced:     `an advanced learner who is comfortable with ${subjectName}`,
  }[priorExperience] ?? `a ${subjectName} learner`

  const styleGuide  = feedbackStyle === 'detailed'
    ? 'Be thorough — include context and examples where useful.'
    : 'Be direct and concise — no over-explaining.'
  const goalsSection = learningGoals ? `Student's learning goals: "${learningGoals}"` : 'No specific learning goals provided.'
  const hasWrong    = wrongAnswerDigest.length > 0
  const hasCorrect  = correctAnswerDigest.length > 0
  const trendLine   = previousScore != null
    ? `- Previous attempt: ${previousScore}/100 (${previousScore < skillIndex ? 'improved ↑' : previousScore > skillIndex ? 'regressed ↓' : 'same →'})`
    : ''

  const prompt = `You are an expert ${subjectName} tutor. Write a structured performance report.

STUDENT PROFILE:
- Experience: ${experienceLabel}
- ${goalsSection}
- Style: ${feedbackStyle}

ASSESSMENT RESULTS:
- Topic: ${topicLabel}
- Band: ${performanceBand} | Skill Index: ${skillIndex}/100
- Accuracy: ${accuracy}% (${correctCount}/${totalQuestions} correct)
- Speed: ${speed}/100 | Stability: ${stability != null ? `${stability}/100` : 'N/A'}
${trendLine}
${hasCorrect ? `\n${correctAnswerDigest}\n` : ''}${hasWrong ? `\n${wrongAnswerDigest}\n` : ''}
Write a report using EXACTLY these delimiters. ${styleGuide}

---BREAKDOWN---
2–3 sentences. Analyse accuracy, speed, and stability patterns. ${previousScore != null ? 'Note whether they improved or regressed vs their previous attempt.' : ''} Describe how performance held up early, mid, and late. Be conversational and specific.

---STRENGTHS---
2–3 bullet lines starting with •, max 14 words each. ${hasCorrect ? 'Name the specific concepts from the correct answers list above.' : `Highlight what they genuinely did well in ${topicLabel}.`} Be encouraging and precise.

---FOCUS---
2–3 bullet lines starting with •, max 16 words each. ${hasWrong ? 'Name EACH incorrect concept from the wrong answers list explicitly. Do not write "review your mistakes" — name the concept.' : `Identify specific ${topicLabel} areas needing improvement.`}

---PLAN---
2–3 sentences. A clear, encouraging learning path to address these gaps.

---STEPS---
3–5 lines in format "1. <action>", max 16 words each. ${hasWrong ? 'Include at least 2 steps that directly address the specific wrong-answer concepts by name.' : 'Give concrete, achievable study recommendations.'} Each step should feel actionable.

Return only the section content between delimiters. No text before ---BREAKDOWN--- or after the last section.`

  try {
    const text = await callAI(prompt, 950, 0.7)
    return text || fallbackDeepReport(performanceBand, topicLabel)
  } catch {
    return fallbackDeepReport(performanceBand, topicLabel)
  }
}

function parseDeepReport(raw) {
  const tags = ['BREAKDOWN', 'STRENGTHS', 'FOCUS', 'PLAN', 'STEPS']
  const sections = {}

  tags.forEach((tag, i) => {
    const start = raw.indexOf(`---${tag}---`)
    if (start === -1) { sections[tag] = ''; return }
    const contentStart = start + tag.length + 6
    const nextTag = tags[i + 1] ? raw.indexOf(`---${tags[i + 1]}---`, contentStart) : -1
    sections[tag] = (nextTag === -1 ? raw.slice(contentStart) : raw.slice(contentStart, nextTag)).trim()
  })

  const parseBullets = str => {
    if (!str) return []
    const hasBullets = str.includes('•') || str.split('\n').some(l => /^[-*]/.test(l.trim()))
    if (!hasBullets) return str.trim() ? [str.trim()] : []
    return str.split('\n').map(l => l.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean)
  }

  const parseSteps = str => {
    if (!str) return []
    return str.split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean)
  }

  return {
    BREAKDOWN: sections.BREAKDOWN || '',
    STRENGTHS: parseBullets(sections.STRENGTHS || ''),
    FOCUS:     parseBullets(sections.FOCUS     || ''),
    PLAN:      sections.PLAN || '',
    STEPS:     parseSteps(sections.STEPS || ''),
  }
}

module.exports = { generateFeedback, generateDeepReport, parseDeepReport }
