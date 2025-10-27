import { useEffect, useState } from "react";

interface LogEntry {
  date: string;
  drill: string;
  bpm?: number;
  notes?: string;
}

export default function LogViewer({ date }: { date: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/traininglog/${date}`);
        if (!res.ok) throw new Error("No logs found");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [date]);

  if (loading) return <p>Loading logs…</p>;
  if (logs.length === 0) return <p>No logs for {date}</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-bold">Training Logs for {date}</h2>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border px-2">Drill</th>
            <th className="border px-2">BPM</th>
            <th className="border px-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td className="border px-2">{log.drill}</td>
              <td className="border px-2">{log.bpm || "-"}</td>
              <td className="border px-2">{log.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
