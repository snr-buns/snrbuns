
export const DAILY_COMBOS = [
  "Eat My Meat",
  "The Heartstopper Meal",
  "Haunted Box",
  "The Spooky Special"
];

export const DAILY_TARGET = 5;
export const DAILY_REWARD =
  "Everyone who worked today gets a $1,000 bonus!";

export const FIRST_CHALLENGE_DATE = "2026-10-21";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

export function nyDateKey(date = new Date()) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(p => [p.type, p.value])
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dayNumber(key) {
  const [year, month, day] = key.split("-").map(Number);

  return Math.floor(
    Date.UTC(year, month - 1, day) / 86400000
  );
}

export function dailyChallenge(dayKey = nyDateKey()) {
  const elapsed =
    dayNumber(dayKey) - dayNumber(FIRST_CHALLENGE_DATE);

  const index =
    ((elapsed % DAILY_COMBOS.length) + DAILY_COMBOS.length)
    % DAILY_COMBOS.length;

  return {
    date: dayKey,
    combo: DAILY_COMBOS[index],
    target: DAILY_TARGET,
    reward: DAILY_REWARD,
    manual: false,
    startAt: null
  };
}

// Use a manager override only for the date it was saved.
export function challengeForDay(
  dayKey = nyDateKey(),
  override = null
) {
  const automatic = dailyChallenge(dayKey);

  if (
    !override?.active ||
    override.date !== dayKey ||
    !DAILY_COMBOS.includes(override.combo) ||
    !Number.isSafeInteger(Number(override.target)) ||
    Number(override.target) < 1 ||
    typeof override.reward !== "string" ||
    !override.reward.trim()
  ) {
    return automatic;
  }

  return {
    date: dayKey,
    combo: override.combo,
    target: Number(override.target),
    reward: override.reward,
    manual: true,
    startAt: override.startAt?.toDate?.() ||
      (override.startAt instanceof Date
        ? override.startAt
        : null)
  };
}

// Calculate sales from saved orders for one New York day.
export function countDailySales(
  orders,
  dayKey,
  override = null
) {
  const challenge = challengeForDay(dayKey, override);

  let sold = 0;
  let completedAt = null;

  // A manual override starts counting at publication.
  // Until its server timestamp exists, don't count sales.
  const dailyOrders = orders
    .filter(order => {
      const date = order.timestamp;

      if (!(date instanceof Date) || isNaN(date)) {
        return false;
      }

      if (nyDateKey(date) !== dayKey) {
        return false;
      }

      if (challenge.manual) {
        return challenge.startAt &&
          date >= challenge.startAt;
      }

      return true;
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  for (const order of dailyOrders) {
    for (const item of Array.isArray(order.items)
      ? order.items : []) {

      if (item?.name !== challenge.combo) continue;

      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        continue;
      }

      sold += quantity;

      if (!completedAt && sold >= challenge.target) {
        completedAt = order.timestamp;
      }
    }
  }

  return {
    ...challenge,
    sold,
    completedAt
  };
}
