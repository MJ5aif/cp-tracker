import { useMemo } from "react";
import useSubmissionsStore from "../../data/hooks/useSubmissionsStore";
import Submission, { getSimpleVerdict, SimpleVerdict, Verdict } from "../../types/CF/Submission";
import { isDefined } from "../../util/util";
import useTheme from "../../data/hooks/useTheme";
import { useAppSelector } from "../../data/store";

export interface UserStats {
	handle: string;
	solvedCount: number;
	attemptedCount: number;
	totalSubmissions: number;
	solvedProblems: Set<string>;
}

function useStatPage() {
	const { rawSubmissions } = useSubmissionsStore();
	const { theme } = useTheme();
	const handles = useAppSelector(state => state.userList.handles);

	const { submissionsByVerdict, problemIDsBySimpleVerdict, userStats, totalStats } = useMemo(() => {
		const groupedProblems = new Map<SimpleVerdict, Map<number, Set<string>>>();
		const groupedSubmissions = new Map<Verdict, Submission[]>();
		
		// Per-user stats
		const userStatsMap = new Map<string, {
			solvedProblems: Set<string>;
			attemptedProblems: Set<string>;
			totalSubmissions: number;
		}>();
		
		// Initialize stats for each handle
		for (const handle of handles) {
			userStatsMap.set(handle.toLowerCase(), {
				solvedProblems: new Set(),
				attemptedProblems: new Set(),
				totalSubmissions: 0,
			});
		}

		// All unique solved problems (combined)
		const allSolvedProblems = new Set<string>();
		const allAttemptedProblems = new Set<string>();

		for (let submission of rawSubmissions) {
			addSubmissionToGroupedByVerdict(submission, groupedSubmissions);
			addSubmissionsProblemToGroupedBySimpleVerdict(submission, groupedProblems);
			
			// Track per-user stats
			const handle = submission.author?.members?.[0]?.handle?.toLowerCase() ?? "";
			const problemId = submission.problem.id;
			
			if (handle && userStatsMap.has(handle)) {
				const stats = userStatsMap.get(handle)!;
				stats.totalSubmissions++;
				
				if (submission.verdict === Verdict.OK) {
					stats.solvedProblems.add(problemId);
					allSolvedProblems.add(problemId);
				} else {
					stats.attemptedProblems.add(problemId);
					allAttemptedProblems.add(problemId);
				}
			}
		}

		for (let submission of rawSubmissions) {
			if (submission.verdict === Verdict.OK)
				groupedProblems.get(SimpleVerdict.ATTEMPTED)?.get(submission.problem.rating)?.delete(submission.problem.id);
		}

		// Build user stats array
		const userStatsArray: UserStats[] = handles.map(handle => {
			const stats = userStatsMap.get(handle.toLowerCase());
			return {
				handle,
				solvedCount: stats?.solvedProblems.size ?? 0,
				attemptedCount: stats?.attemptedProblems.size ?? 0,
				totalSubmissions: stats?.totalSubmissions ?? 0,
				solvedProblems: stats?.solvedProblems ?? new Set(),
			};
		});

		// Remove solved from attempted for accurate count
		for (const problemId of allSolvedProblems) {
			allAttemptedProblems.delete(problemId);
		}

		const totalStatsData = {
			totalSolved: allSolvedProblems.size,
			totalAttempted: allAttemptedProblems.size,
			totalSubmissions: rawSubmissions.length,
		};

		return { 
			submissionsByVerdict: groupedSubmissions, 
			problemIDsBySimpleVerdict: groupedProblems,
			userStats: userStatsArray,
			totalStats: totalStatsData,
		};
	}, [rawSubmissions, handles]);

	function addSubmissionToGroupedByVerdict(submission: Submission, groupedSubmissions: Map<Verdict, Submission[]>) {
		if (!isDefined(groupedSubmissions.get(submission.verdict)))
			groupedSubmissions.set(submission.verdict, []);
		groupedSubmissions.get(submission.verdict)?.push(submission);
	}

	function addSubmissionsProblemToGroupedBySimpleVerdict(submission: Submission, groupedProblems: Map<SimpleVerdict, Map<number, Set<string>>>) {
		const verdict = getSimpleVerdict(submission.verdict);
		if (!isDefined(groupedProblems.get(verdict))) {
			groupedProblems.set(verdict, new Map());
		}

		if (!isDefined(groupedProblems.get(verdict)?.get(submission.problem.rating))) {
			groupedProblems.get(verdict)?.set(submission.problem.rating, new Set());
		}

		groupedProblems.get(verdict)?.get(submission.problem.rating)?.add(submission.problem.id);
	}


	return { submissionsByVerdict, problemIDsBySimpleVerdict, theme, userStats, totalStats, handles };
}

export default useStatPage;