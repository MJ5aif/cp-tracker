import ContestCategoriesByACPercentage from "./charts/ContestCategoriesByACPercentage";
import RatingByACPercentage from "./charts/RatingByACPercentage";
import SolveCountByRating from "./charts/SolveCountByRating";
import SubmissionsByVerdict from "./charts/SubmissionsByVerdict";
import SubmissionsHeatMap from "./charts/SubmissionsHeatMap";
import useStatPage from "./useStatPage";
import { getUserColor } from "../../util/userColors";

/**
 * TODO:
 * percentage of problem solved by problem index
 * percentage of problem solved by rating
 */
const StatPage = () => {
  const { problemIDsBySimpleVerdict, submissionsByVerdict, userStats, totalStats, handles } = useStatPage();

  return (
    <div className="container pb-5">
      {/* Stats Summary Cards */}
      <div className="row justify-content-center mb-4">
        <div className="col-12">
          <div className="stats-summary-container">
            {/* Total Stats Card */}
            <div className="stats-card total-stats">
              <div className="stats-card-header">
                <span className="stats-icon">📊</span>
                <span>Overall Stats</span>
              </div>
              <div className="stats-card-body">
                <div className="stat-item">
                  <span className="stat-value">{totalStats.totalSolved}</span>
                  <span className="stat-label">Problems Solved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{totalStats.totalAttempted}</span>
                  <span className="stat-label">Attempted</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{totalStats.totalSubmissions}</span>
                  <span className="stat-label">Total Submissions</span>
                </div>
              </div>
            </div>

            {/* Per-User Stats Cards */}
            {handles.length > 0 && userStats.map((user, index) => {
              const color = getUserColor(index);
              return (
                <div 
                  key={user.handle} 
                  className="stats-card user-stats"
                  style={{ borderLeftColor: color.bg }}
                >
                  <div className="stats-card-header" style={{ color: color.bg }}>
                    <span 
                      className="user-badge"
                      style={{ backgroundColor: color.bg }}
                    >
                      {user.handle.charAt(0).toUpperCase()}
                    </span>
                    <span>{user.handle}</span>
                  </div>
                  <div className="stats-card-body">
                    <div className="stat-item">
                      <span className="stat-value" style={{ color: color.bg }}>{user.solvedCount}</span>
                      <span className="stat-label">Solved</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{user.totalSubmissions}</span>
                      <span className="stat-label">Submissions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="row justify-content-center" style={{ height: "500px" }}>
        <SubmissionsByVerdict submissionsByVerdict={submissionsByVerdict} />
      </div>
      <div className="row justify-content-center mb-5 mt-5" style={{ height: "500px" }}>
        <SolveCountByRating problemIDsGroupedBySimpleVerdict={problemIDsBySimpleVerdict} />
      </div>
      <div className="row justify-content-center mb-5" style={{ height: "500px" }}>
        <RatingByACPercentage />
      </div>
      <div className="mt-5 mb-5">
        <ContestCategoriesByACPercentage />
      </div>
      <div className="row justify-content-center mt-5 w-100">
        <SubmissionsHeatMap />
      </div>
    </div>
  );
};

export default StatPage;
