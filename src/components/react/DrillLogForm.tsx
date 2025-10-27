const DrillLogForm = () => {
  const [entry, setEntry] = useState({ date: "", bpm: "", notes: "" });

  const handleSubmit = async () => {
    // POST to an API route or local file writer
    await fetch("/api/traininglog", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={entry.date} />
      <input type="number" value={entry.bpm} />
      <textarea value={entry.notes} />
      <button type="submit">Save Log</button>
    </form>
  );
};
