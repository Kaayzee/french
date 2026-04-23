import "../styles/ScoreBoard.css";

export default function ScoreBoard({ score, history }) {
  return (
    <div className="container mt-4">

      <h3 className="score-title">Score: {score}</h3>

      <div className="table-wrapper">
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
                <td>
                  {item.direction === "fr-en" ? item.fr : item.en}
                </td>

                <td>
                  {item.direction === "fr-en" ? item.en : item.fr}
                </td>

                <td>{item.userAnswer}</td>
                <td>
                  {item.skipped === "know" ? (
                    <span className="badge bg-success">👍Known</span>
                  ) : item.skipped === "dontKnow" ? (
                    <span className="badge bg-warning text-dark">👎Don’t know</span>
                  ) : item.isCorrect ? (
                    <span className="badge bg-primary">✅Correct</span>
                  ) : (
                    <span className="badge bg-danger">❌Wrong</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}