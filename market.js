async function clearMarketRuns() {
  const snap = await getDocs(collection(db, "market_runs"));
  const batch = writeBatch(db);
  snap.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Deleted ${snap.size} market run documents`);
}

// Call it manually when you need
clearMarketRuns();
