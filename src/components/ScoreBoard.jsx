import "../styles/ScoreBoard.css";

export default function ScoreBoard({ score, history }) {
  return (
    <div className="container mt-4">

      <h2 className="mb-3">Score: {score}</h2>

      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>French</th>
            <th>English</th>
            <th>Your Answer</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              <td>{item.fr}</td>
              <td>{item.en}</td>
              <td>{item.userAnswer}</td>
              <td>
                {item.skipped
                  ? "Know 🎉"
                  : item.isCorrect
                  ? "✅"
                  : "❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}