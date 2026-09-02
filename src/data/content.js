/**
 * Every line of copy lives here so it can be personalised without touching
 * component code. Change `HER_NAME` first — everything else is optional.
 */

export const HER_NAME = '' // e.g. 'Aisha'. Leave empty to use "beautiful".

export const term = HER_NAME || 'beautiful'

export const DATE_PLANS = [
  {
    id: 'coffee',
    emoji: '☕',
    title: 'Coffee + Long Talks',
    line: 'Because I could listen to you forever.',
    detail: 'Corner table, two cups, zero rush. We stay until they start stacking chairs.',
    accent: 'from-[#F6C89F] to-[#E2843E]',
  },
  {
    id: 'movie',
    emoji: '🎬',
    title: 'Movie + Snacks',
    line: "You choose the movie. I'll pretend not to fall asleep.",
    detail: 'You get full remote privileges. I get to steal exactly 40% of the popcorn.',
    accent: 'from-[#FFA8C5] to-[#C42B4C]',
  },
  {
    id: 'walk',
    emoji: '🌙',
    title: 'Evening Walk + Dinner',
    line: 'Good food + good company = perfect.',
    detail: 'We walk until we are hungry, eat too much, then walk again to justify dessert.',
    accent: 'from-[#B9A7F0] to-[#6A4FB6]',
  },
]

export const MOODS = [
  {
    id: 'romantic',
    emoji: '❤️',
    label: 'Romantic',
    response: 'Noted. I will overthink my outfit for four days straight.',
  },
  {
    id: 'funny',
    emoji: '😂',
    label: 'Funny',
    response: 'Perfect. I have been saving my worst jokes especially for you.',
  },
  {
    id: 'adventure',
    emoji: '🌍',
    label: 'Adventure',
    response: 'Dangerous choice. I have zero sense of direction and full confidence.',
  },
  {
    id: 'justus',
    emoji: '🥰',
    label: 'Just You & Me',
    response: 'Honestly? My favourite answer. Nowhere to be, no one else invited.',
  },
]

/** Rotating taunts for the runaway NO button. */
export const NO_TAUNTS = [
  'Are you sure? 🥺',
  'Think again 😭',
  'That button seems broken 👀',
  'Nice try 😂',
  'Wrong button!',
  'Your finger accidentally missed 😌',
  'Maybe you should try YES ❤️',
  'The button has commitment issues 🏃',
  'It slipped. Happens to everyone 🙃',
  'I am choosing to read that as a yes 😇',
  'Physics said no 🧲',
  'Okay that one was close 😳',
]

/** NO button label evolves the more she chases it. */
export const NO_LABELS = [
  'NO 😌',
  'No? 😅',
  'Still no? 🥺',
  'Are we sure? 😭',
  'Hmm... 👀',
  'Okay okay... YES? 🥺',
]

export const MAYBE_REPLIES = [
  '"Maybe" is just a yes wearing a disguise 😏',
  'Maybe means you are already picking an outfit 👀',
  'I will take "maybe" as a 94% yes ❤️',
  'Bold of you to negotiate with someone this persistent 😌',
]
