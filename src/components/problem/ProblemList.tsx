import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getProblemUrl } from "../../util/util";
import { ATTEMPTED_PROBLEMS, SOLVED_PROBLEMS } from "../../util/constants";
import Problem from "../../types/CF/Problem";
import Theme, { ThemesType } from "../../util/Theme";
import { getUserColor, getMixedSolvedColor } from "../../util/userColors";

interface ProblemListProps {
  problems: Problem[];
  perPage: number;
  pageSelected: number;
  theme: Theme;
  solved: Set<string>;
  attempted: Set<string>;
  problemSolvers: Map<string, Set<string>>;
  userColorMap: Map<string, number>;
  showAddToList: boolean;
  problemsAddedToList: Set<string>;
  addToList: (id: string) => void;
  deleteFromList: (id: string) => void;
}

const ProblemList = (props: ProblemListProps): JSX.Element => {
  const isDark = props.theme.themeType === ThemesType.DARK;

  const getState = (problem: Problem) => {
    if (props.solved.has(problem.id)) return SOLVED_PROBLEMS;
    if (props.attempted.has(problem.id)) return ATTEMPTED_PROBLEMS;
    return "UNSOLVED";
  };

  const getBackgroundStyle = (problem: Problem): { className: string; style?: React.CSSProperties; title?: string } => {
    const problemState = getState(problem);
    const solvers = props.problemSolvers.get(problem.id);
    
    if (problemState === SOLVED_PROBLEMS && solvers && solvers.size > 0) {
      if (solvers.size === 1) {
        // Single user solved - use their specific color
        const solverHandle = Array.from(solvers)[0];
        const colorIndex = props.userColorMap.get(solverHandle);
        if (colorIndex !== undefined) {
          return {
            className: "",
            style: { backgroundColor: getUserColor(colorIndex, isDark) },
            title: `Solved by: ${solverHandle}`
          };
        }
      } else {
        // Multiple users solved - use mixed color
        return {
          className: "",
          style: { backgroundColor: getMixedSolvedColor(isDark) },
          title: `Solved by: ${Array.from(solvers).join(", ")}`
        };
      }
      return { className: props.theme.bgSuccess };
    } else if (problemState === ATTEMPTED_PROBLEMS) {
      return { className: props.theme.bgDanger };
    }
    return { className: props.theme.bg };
  };

  const ProblemCard = (problem: Problem, index: number) => {
    const { className: bgClass, style: bgStyle, title } = getBackgroundStyle(problem);
    
    return (
      <tr key={problem.id} title={title}>
        <td className={"id font-weight-bold p-2 " + bgClass} style={bgStyle}>{props.pageSelected * props.perPage + index + 1}</td>
        <td className={"id font-weight-bold " + bgClass} style={bgStyle}>
          <a
            className={"text-decoration-none p-2 " + " " + props.theme.text}
            target="_blank"
            rel="noreferrer"
            href={getProblemUrl(problem.contestId, problem.index)}
          >
            {problem.id}
          </a>
        </td>
        <td className={"name " + bgClass} style={bgStyle}>
          <a
            className={"text-decoration-none p-2 " + " " + props.theme.text}
            target="_blank"
            rel="noreferrer"
            title={problem.tags.toString()}
            href={getProblemUrl(problem.contestId, problem.index)}
          >
            {problem.name}
          </a>
        </td>
        <td className={"rating p-2 " + bgClass} style={bgStyle}>{problem.rating > 0 ? problem.rating : "Not Rated(0)"}</td>

        <td className={"solvedCount p-2 " + bgClass} style={bgStyle}>{problem.solvedCount}</td>
        {props.showAddToList && (
          <td className="p-2">
            {" "}
            {props.problemsAddedToList.has(problem.id) ? (
              <button
                type="button"
                className={"btn " + props.theme.btnDanger}
                onClick={() => props.deleteFromList(problem.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            ) : (
              <button type="button" className={"btn " + props.theme.btn} onClick={() => props.addToList(problem.id)}>
                <FontAwesomeIcon icon={faAdd} />
              </button>
            )}
          </td>
        )}
      </tr>
    );
  };

  return (
    <React.Fragment>
      {props.problems.map((problem: Problem, index: number) => {
        return ProblemCard(problem, index);
      })}
    </React.Fragment>
  );
};

export default ProblemList;
