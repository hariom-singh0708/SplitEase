/**
 * Given a list of expenses for a group and a list of member ObjectIds,
 * compute net balance per user and minimal settlements (who pays whom).
 * 
 * - Positive balance => others owe this user.
 * - Negative balance => this user owes others.
 */
export const computeBalances = (expenses, memberIds) => {
  const toKey = (id) => String(id);
  const members = memberIds.map(toKey);

  const net = {}; // userId => number
  members.forEach((id) => (net[id] = 0));

  for (const e of expenses) {
    const amount = Number(e.amount);
    const participants = (e.participants?.length ? e.participants : members).map(toKey);
    const perHead = amount / participants.length;

    // credit payer
    const paidBy = toKey(e.paidBy);
    if (!(paidBy in net)) net[paidBy] = 0;
    net[paidBy] += amount;

    // debit participants
    for (const p of participants) {
      if (!(p in net)) net[p] = 0;
      net[p] -= perHead;
    }
  }

  // Round to cents/paise precision to prevent FP drift
  for (const k of Object.keys(net)) {
    net[k] = Math.round(net[k] * 100) / 100;
    if (Math.abs(net[k]) < 0.01) net[k] = 0; // normalize near-zero
  }

  // Build settlements (greedy)
  const creditors = [];
  const debtors = [];
  for (const [id, bal] of Object.entries(net)) {
    if (bal > 0) creditors.push({ id, amt: bal });
    else if (bal < 0) debtors.push({ id, amt: -bal }); // positive amt owed
  }
  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);

  const settlements = []; // { from, to, amount }
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    settlements.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(pay * 100) / 100 });
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt <= 0.009) i++;
    if (creditors[j].amt <= 0.009) j++;
  }

  return { net, settlements };
};
