// College football decision logic.
// Sources: standard 2-pt conversion value charts (go-for-2 math), NCAA clock rules.

export type GoForTwoInput = {
  margin: number; // your score minus opponent score, BEFORE this extra point/2pt decision
  quarter: 1 | 2 | 3 | 4 | 5; // 5 = OT
  secondsRemaining: number; // in current quarter/OT period
  possessionAfterScore: "you" | "opponent" | "unsure"; // who gets ball next if game continues
};

export type GoForTwoResult = {
  recommendation: "Kick the PAT" | "Go for 2" | "Either works (toss-up)";
  reasoning: string[];
};

// Core idea: after a TD, decide the resulting margin you want to be at.
// Standard chart logic (Romer/analytics-community consensus), adapted with
// college-specific OT awareness (NCAA OT = each team gets a possession from the 25,
// no kicking for OT after 2nd extra session -> 2pt attempts mandatory in later rounds).
export function goForTwoAdvice(input: GoForTwoInput): GoForTwoResult {
  const { margin, quarter, secondsRemaining, possessionAfterScore } = input;
  const reasoning: string[] = [];
  const isLateGame = quarter >= 4 && secondsRemaining <= 300; // last 5 min of reg or OT
  const isOT = quarter === 5;

  if (isOT) {
    reasoning.push("Overtime: NCAA rules require 2-point attempts starting in the 3rd OT period — no kicking allowed at that stage.");
    reasoning.push("Before then, kicking is standard unless you're already down 2 and scoring makes this a tie-or-win decision.");
    if (margin === -2 || margin === -1) {
      return {
        recommendation: "Go for 2",
        reasoning: [...reasoning, "You're down 1-2: converting wins the game outright instead of extending to another OT period."],
      };
    }
    return { recommendation: "Kick the PAT", reasoning };
  }

  // Late-game situations dominate the decision tree.
  if (isLateGame) {
    // Common "known" margins from 2-point charts, adapted for a made TD (pre-PAT margin).
    if (margin === -2) {
      reasoning.push("Down 2 after the TD: converting ties the game; kicking only ties it too if you kick... no — down 2, a made PAT still leaves you down 1. Going for 2 to WIN or at minimum forces a different math on the ensuing drive.");
      return { recommendation: "Go for 2", reasoning };
    }
    if (margin === -1) {
      reasoning.push("Down 1 after the TD: kick to go up 1 for the simplest lead; going for 2 (if converted) puts you up 2, which is safer against a game-tying FG.");
      reasoning.push("If you trust your 2pt package, going for 2 here removes the other team's ability to simply kick a FG to win.");
      return { recommendation: "Either works (toss-up)", reasoning };
    }
    if (margin === -8) {
      reasoning.push("Down 8 after the TD: a made 2pt ties the game outright. This is the textbook 'go for 2' spot.");
      return { recommendation: "Go for 2", reasoning };
    }
    if (margin === -5) {
      reasoning.push("Down 5: kicking leaves you down 4 (still need a TD). Converting 2 leaves you down 3 (FG range ties it). Go for 2.");
      return { recommendation: "Go for 2", reasoning };
    }
    if (margin === 2 || margin === 1) {
      reasoning.push("You're up slightly late: kicking to extend the lead by 1 is fine, but consider opponent's likely response (TD ties/wins vs FG only ties).");
      reasoning.push(`If you're up ${margin} and worried about a single opponent TD+2 beating you, going for 2 to go up ${margin + 1} changes their math.`);
      return { recommendation: "Either works (toss-up)", reasoning };
    }
  }

  reasoning.push("Not a critical late-game situation — default to the standard, higher-percentage play.");
  reasoning.push("Kicking the PAT (~94% success nationally) preserves points; only deviate with a clear numerical edge.");
  return { recommendation: "Kick the PAT", reasoning };
}

export type ClockInput = {
  yourTimeouts: 0 | 1 | 2 | 3;
  opponentTimeouts: 0 | 1 | 2 | 3;
  secondsRemaining: number;
  down: 1 | 2 | 3 | 4;
  havePossession: boolean;
  needFirstDown: boolean; // are you trying to just bleed clock (kneel) or must convert to keep drive alive
};

export type ClockResult = {
  headline: string;
  details: string[];
};

// NCAA-specific clock behavior baked in:
// - Clock stops on a new first down until the ball is marked ready for play (unlike NFL).
// - 40-second play clock between snaps when clock is running.
// - Kneel-downs run ~40s off with no timeout; a timeout stops it at the snap.
export function clockAdvice(input: ClockInput): ClockResult {
  const { yourTimeouts, opponentTimeouts, secondsRemaining, down, havePossession, needFirstDown } = input;
  const details: string[] = [];

  if (!havePossession) {
    details.push(`Defense: opponent has ${yourTimeouts} timeout(s) mentally budgeted against your ${opponentTimeouts}. Force them to use timeouts before conceding easy yardage.`);
    details.push("Remember: in college, the clock stops on ANY first down (yours or theirs) until the ball is next marked ready — this is the #1 rule that differs from the NFL and changes end-game math.");
    return { headline: "You're on defense — manage stoppages, don't panic on the clock.", details };
  }

  if (needFirstDown) {
    // Trying to end the game by kneeling / running clock without needing to convert.
    const snapsToZero = Math.ceil(secondsRemaining / 40);
    details.push(`At ~40 seconds per snap with the clock running, it takes about ${snapsToZero} more snap(s) to reach 0:00 if opponent doesn't stop the clock.`);
    details.push(`Opponent has ${opponentTimeouts} timeout(s) left — each one gives them back roughly 40 seconds AND a clock stop, so budget for ${opponentTimeouts} extra snaps beyond the raw count.`);
    if (down === 1 && opponentTimeouts === 0 && secondsRemaining <= 120) {
      details.push("1st down, 2:00 or less, opponent has zero timeouts: you can kneel it out. Game over on your terms.");
      return { headline: "Kneel it out — clock cannot be stopped.", details };
    }
    details.push("Keep the ball on the ground, stay in bounds, and only throw if you fail to convert a needed first down under this plan.");
    return { headline: `Bleed clock: ~${snapsToZero + opponentTimeouts} snaps needed to finish the game.`, details };
  }

  // Must convert to keep the drive/clock alive (you're not just protecting a lead).
  details.push("You need this conversion to keep the clock moving in your favor — an incompletion or short gain here hands time back to the opponent via the stopped clock.");
  details.push(`You're carrying ${yourTimeouts} timeout(s); save at least one for a potential final defensive stand if this drive stalls.`);
  return { headline: `Down ${down}: convert to keep control — clock discipline over aggression.`, details };
}
