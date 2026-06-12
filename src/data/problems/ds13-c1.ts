import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch13-c-001',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Merge Overlapping Intervals',
    prompt: `Implement:

    fn merge(intervals: &[(i32, i32)]) -> Vec<(i32, i32)>

Each pair (start, end) is an inclusive interval. Merge all overlapping or touching intervals and return them sorted by start.
Intervals touch if one ends exactly where the next begins.
Example: [(1, 3), (2, 6), (8, 10)] -> [(1, 6), (8, 10)]`,
    hints: ['Sort by start time first.', 'Walk through and extend the last merged interval while the next start is within its end.'],
    solution: `fn merge(intervals: &[(i32, i32)]) -> Vec<(i32, i32)> {
    let mut iv: Vec<(i32, i32)> = intervals.to_vec();
    iv.sort();
    let mut out: Vec<(i32, i32)> = Vec::new();
    for (s, e) in iv {
        if let Some(last) = out.last_mut() {
            if s <= last.1 {
                last.1 = last.1.max(e);
                continue;
            }
        }
        out.push((s, e));
    }
    out
}

fn main() {
    assert_eq!(merge(&[(1, 3), (2, 6), (8, 10)]), vec![(1, 6), (8, 10)]);
    assert_eq!(merge(&[(1, 4), (4, 5)]), vec![(1, 5)]);
    assert_eq!(merge(&[]), Vec::<(i32, i32)>::new());
    assert_eq!(merge(&[(1, 1)]), vec![(1, 1)]);
    println!("ok");
}`,
    starter: `fn merge(intervals: &[(i32, i32)]) -> Vec<(i32, i32)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(merge(&[(1, 3), (2, 6), (8, 10)]), vec![(1, 6), (8, 10)]);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-002',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Insert and Merge Interval',
    prompt: `Implement:

    fn insert(intervals: &[(i32, i32)], new: (i32, i32)) -> Vec<(i32, i32)>

Given a list of non-overlapping intervals sorted by start, insert a new interval and merge if necessary.
Return the resulting list, still sorted and non-overlapping.
Example: intervals=[(1,3),(6,9)], new=(2,5) -> [(1,5),(6,9)]`,
    hints: ['Add all intervals ending before new.start directly.', 'Merge overlapping intervals by expanding new, then add the rest.'],
    solution: `fn insert(intervals: &[(i32, i32)], new: (i32, i32)) -> Vec<(i32, i32)> {
    let mut result: Vec<(i32, i32)> = Vec::new();
    let mut merged = new;
    let mut inserted = false;
    for &(s, e) in intervals {
        if e < merged.0 {
            result.push((s, e));
        } else if s > merged.1 {
            if !inserted {
                result.push(merged);
                inserted = true;
            }
            result.push((s, e));
        } else {
            merged.0 = merged.0.min(s);
            merged.1 = merged.1.max(e);
        }
    }
    if !inserted {
        result.push(merged);
    }
    result
}

fn main() {
    assert_eq!(insert(&[(1, 3), (6, 9)], (2, 5)), vec![(1, 5), (6, 9)]);
    assert_eq!(insert(&[(1, 2), (3, 5), (6, 7), (8, 10), (12, 16)], (4, 8)), vec![(1, 2), (3, 10), (12, 16)]);
    assert_eq!(insert(&[], (1, 5)), vec![(1, 5)]);
    assert_eq!(insert(&[(1, 5)], (6, 8)), vec![(1, 5), (6, 8)]);
    println!("ok");
}`,
    starter: `fn insert(intervals: &[(i32, i32)], new: (i32, i32)) -> Vec<(i32, i32)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(insert(&[(1, 3), (6, 9)], (2, 5)), vec![(1, 5), (6, 9)]);
    println!("ok");
}`,
    tags: ['greedy', 'intervals'],
  },
  {
    id: 'ds-ch13-c-003',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Can Attend All Meetings',
    prompt: `Implement:

    fn can_attend_all(intervals: &[(i32, i32)]) -> bool

Given a list of meeting time intervals (start, end), return true if a person can attend every meeting without any overlap.
Two meetings overlap if one starts strictly before the other ends.
Example: [(0,30),(5,10),(15,20)] -> false; [(7,10),(2,4)] -> true`,
    hints: ['Sort intervals by start time.', 'Check each adjacent pair: if the next start is before the previous end, there is a conflict.'],
    solution: `fn can_attend_all(intervals: &[(i32, i32)]) -> bool {
    let mut iv = intervals.to_vec();
    iv.sort();
    for i in 1..iv.len() {
        if iv[i].0 < iv[i - 1].1 {
            return false;
        }
    }
    true
}

fn main() {
    assert_eq!(can_attend_all(&[(0, 30), (5, 10), (15, 20)]), false);
    assert_eq!(can_attend_all(&[(7, 10), (2, 4)]), true);
    assert_eq!(can_attend_all(&[]), true);
    assert_eq!(can_attend_all(&[(1, 5), (5, 10)]), true);
    assert_eq!(can_attend_all(&[(1, 5), (4, 10)]), false);
    println!("ok");
}`,
    starter: `fn can_attend_all(intervals: &[(i32, i32)]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(can_attend_all(&[(0, 30), (5, 10), (15, 20)]), false);
    assert_eq!(can_attend_all(&[(7, 10), (2, 4)]), true);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-004',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove Minimum Intervals to Make Non-Overlapping',
    prompt: `Implement:

    fn erase_overlap(intervals: &[(i32, i32)]) -> i32

Given a list of intervals, return the minimum number of intervals to remove so that no two remaining intervals overlap.
Intervals that share just an endpoint do not overlap.
Example: [(1,2),(2,3),(3,4),(1,3)] -> 1 (remove (1,3))`,
    hints: ['Sort by end time and greedily keep intervals with the earliest end.', 'Count how many you keep; the answer is total minus kept.'],
    solution: `fn erase_overlap(intervals: &[(i32, i32)]) -> i32 {
    if intervals.is_empty() {
        return 0;
    }
    let mut iv = intervals.to_vec();
    iv.sort_by_key(|x| x.1);
    let mut count = 0;
    let mut last_end = i32::MIN;
    for (s, e) in iv {
        if s >= last_end {
            last_end = e;
        } else {
            count += 1;
        }
    }
    count
}

fn main() {
    assert_eq!(erase_overlap(&[(1, 2), (2, 3), (3, 4), (1, 3)]), 1);
    assert_eq!(erase_overlap(&[(1, 2), (1, 2), (1, 2)]), 2);
    assert_eq!(erase_overlap(&[(1, 2), (2, 3)]), 0);
    assert_eq!(erase_overlap(&[]), 0);
    println!("ok");
}`,
    starter: `fn erase_overlap(intervals: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(erase_overlap(&[(1, 2), (2, 3), (3, 4), (1, 3)]), 1);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-005',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Assign Cookies to Children',
    prompt: `Implement:

    fn assign_cookies(children: &[i32], cookies: &[i32]) -> i32

Each child has a greed factor; each cookie has a size. A cookie satisfies a child if its size is at least the child greed factor.
Each child gets at most one cookie. Return the maximum number of children you can satisfy.
Example: children=[1,2,3], cookies=[1,1] -> 1; children=[1,2], cookies=[1,2,3] -> 2`,
    hints: ['Sort both arrays.', 'Use two pointers: try to satisfy the least greedy child with the smallest available cookie.'],
    solution: `fn assign_cookies(children: &[i32], cookies: &[i32]) -> i32 {
    let mut g = children.to_vec();
    let mut s = cookies.to_vec();
    g.sort();
    s.sort();
    let mut ci = 0;
    let mut si = 0;
    while ci < g.len() && si < s.len() {
        if s[si] >= g[ci] {
            ci += 1;
        }
        si += 1;
    }
    ci as i32
}

fn main() {
    assert_eq!(assign_cookies(&[1, 2, 3], &[1, 1]), 1);
    assert_eq!(assign_cookies(&[1, 2], &[1, 2, 3]), 2);
    assert_eq!(assign_cookies(&[10, 9, 8, 7], &[5, 6, 7, 8]), 2);
    assert_eq!(assign_cookies(&[], &[1, 2]), 0);
    println!("ok");
}`,
    starter: `fn assign_cookies(children: &[i32], cookies: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(assign_cookies(&[1, 2, 3], &[1, 1]), 1);
    assert_eq!(assign_cookies(&[1, 2], &[1, 2, 3]), 2);
    println!("ok");
}`,
    tags: ['greedy', 'sorting', 'two pointers'],
  },
  {
    id: 'ds-ch13-c-006',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Lemonade Change',
    prompt: `Implement:

    fn lemonade_change(bills: &[i32]) -> bool

A lemonade stand sells each cup for $5. Customers pay with a $5, $10, or $20 bill.
You must give exact change. You start with no change. Return true if you can serve every customer.
Example: [5,5,5,10,20] -> true; [5,5,10,10,20] -> false`,
    hints: ['Track counts of $5 and $10 bills you hold.', 'For a $20 bill, prefer giving $10+$5 over three $5 bills to preserve $5s.'],
    solution: `fn lemonade_change(bills: &[i32]) -> bool {
    let mut five = 0i32;
    let mut ten = 0i32;
    for &b in bills {
        match b {
            5 => five += 1,
            10 => {
                if five == 0 {
                    return false;
                }
                five -= 1;
                ten += 1;
            }
            20 => {
                if ten > 0 && five > 0 {
                    ten -= 1;
                    five -= 1;
                } else if five >= 3 {
                    five -= 3;
                } else {
                    return false;
                }
            }
            _ => {}
        }
    }
    true
}

fn main() {
    assert_eq!(lemonade_change(&[5, 5, 5, 10, 20]), true);
    assert_eq!(lemonade_change(&[5, 5, 10, 10, 20]), false);
    assert_eq!(lemonade_change(&[5]), true);
    assert_eq!(lemonade_change(&[10, 10]), false);
    assert_eq!(lemonade_change(&[5, 5, 5, 5, 20, 20]), false);
    println!("ok");
}`,
    starter: `fn lemonade_change(bills: &[i32]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(lemonade_change(&[5, 5, 5, 10, 20]), true);
    assert_eq!(lemonade_change(&[5, 5, 10, 10, 20]), false);
    println!("ok");
}`,
    tags: ['greedy', 'simulation'],
  },
  {
    id: 'ds-ch13-c-007',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Jump Game: Can Reach End',
    prompt: `Implement:

    fn can_jump(nums: &[i32]) -> bool

Each element nums[i] gives the maximum jump length from position i. Starting at index 0, return true if you can reach the last index.
Example: [2,3,1,1,4] -> true; [3,2,1,0,4] -> false`,
    hints: ['Track the farthest reachable index as you walk forward.', 'If at any point you are beyond the farthest reachable index, return false.'],
    solution: `fn can_jump(nums: &[i32]) -> bool {
    let n = nums.len();
    if n == 0 {
        return true;
    }
    let mut max_reach = 0usize;
    for i in 0..n {
        if i > max_reach {
            return false;
        }
        let reach = i + nums[i] as usize;
        if reach >= n - 1 {
            return true;
        }
        if reach > max_reach {
            max_reach = reach;
        }
    }
    max_reach >= n - 1
}

fn main() {
    assert_eq!(can_jump(&[2, 3, 1, 1, 4]), true);
    assert_eq!(can_jump(&[3, 2, 1, 0, 4]), false);
    assert_eq!(can_jump(&[0]), true);
    assert_eq!(can_jump(&[1, 0]), true);
    assert_eq!(can_jump(&[0, 1]), false);
    println!("ok");
}`,
    starter: `fn can_jump(nums: &[i32]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(can_jump(&[2, 3, 1, 1, 4]), true);
    assert_eq!(can_jump(&[3, 2, 1, 0, 4]), false);
    println!("ok");
}`,
    tags: ['greedy', 'arrays'],
  },
  {
    id: 'ds-ch13-c-008',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Gas Station Circuit',
    prompt: `Implement:

    fn gas_station(gas: &[i32], cost: &[i32]) -> i32

There are n gas stations in a circle. gas[i] is the fuel gained at station i; cost[i] is the fuel to travel to the next station.
Return the starting station index from which you can complete the full circuit, or -1 if impossible.
If a solution exists it is guaranteed unique.
Example: gas=[1,2,3,4,5], cost=[3,4,5,1,2] -> 3`,
    hints: ['If total gas < total cost, it is impossible.', 'Reset the start whenever the running tank goes negative; the valid start is after the last reset.'],
    solution: `fn gas_station(gas: &[i32], cost: &[i32]) -> i32 {
    let total: i32 = gas.iter().zip(cost.iter()).map(|(g, c)| g - c).sum();
    if total < 0 {
        return -1;
    }
    let mut tank = 0i32;
    let mut start = 0usize;
    for i in 0..gas.len() {
        tank += gas[i] - cost[i];
        if tank < 0 {
            tank = 0;
            start = i + 1;
        }
    }
    start as i32
}

fn main() {
    assert_eq!(gas_station(&[1, 2, 3, 4, 5], &[3, 4, 5, 1, 2]), 3);
    assert_eq!(gas_station(&[2, 3, 4], &[3, 4, 3]), -1);
    assert_eq!(gas_station(&[5], &[4]), 0);
    println!("ok");
}`,
    starter: `fn gas_station(gas: &[i32], cost: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(gas_station(&[1, 2, 3, 4, 5], &[3, 4, 5, 1, 2]), 3);
    assert_eq!(gas_station(&[2, 3, 4], &[3, 4, 3]), -1);
    println!("ok");
}`,
    tags: ['greedy', 'arrays'],
  },
  {
    id: 'ds-ch13-c-009',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Partition Labels',
    prompt: `Implement:

    fn partition_labels(s: &str) -> Vec<i32>

Partition string s into as many parts as possible so that each letter appears in at most one part.
Return a list of the sizes of these parts in order. s consists of lowercase English letters only.
Example: "ababcbacadefegdehijhklij" -> [9, 7, 8]`,
    hints: ['Record the last occurrence index of each character.', 'Walk through; extend the current partition end to max last-occurrence seen so far. Close the partition when you reach its end.'],
    solution: `fn partition_labels(s: &str) -> Vec<i32> {
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut last = [0usize; 26];
    for (i, &b) in bytes.iter().enumerate() {
        last[(b - b'a') as usize] = i;
    }
    let mut result = Vec::new();
    let mut start = 0;
    let mut end = 0;
    for i in 0..n {
        let e = last[(bytes[i] - b'a') as usize];
        if e > end {
            end = e;
        }
        if i == end {
            result.push((end - start + 1) as i32);
            start = i + 1;
            end = i + 1;
        }
    }
    result
}

fn main() {
    assert_eq!(partition_labels("ababcbacadefegdehijhklij"), vec![9, 7, 8]);
    assert_eq!(partition_labels("eccbbbbdec"), vec![10]);
    assert_eq!(partition_labels("a"), vec![1]);
    assert_eq!(partition_labels("ab"), vec![1, 1]);
    println!("ok");
}`,
    starter: `fn partition_labels(s: &str) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(partition_labels("ababcbacadefegdehijhklij"), vec![9, 7, 8]);
    println!("ok");
}`,
    tags: ['greedy', 'strings', 'intervals'],
  },
  {
    id: 'ds-ch13-c-010',
    chapter: 13,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Minimum Arrows to Burst Balloons',
    prompt: `Implement:

    fn min_arrows(balloons: &[(i32, i32)]) -> i32

Each balloon is a horizontal segment on the x-axis given by (x_start, x_end). An arrow shot vertically at position x bursts all balloons where x_start <= x <= x_end.
Return the minimum number of arrows needed to burst all balloons.
Example: [(10,16),(2,8),(1,6),(7,12)] -> 2`,
    hints: ['Sort by end coordinate.', 'Greedily shoot at the end of the current balloon; skip any balloon already burst.'],
    solution: `fn min_arrows(balloons: &[(i32, i32)]) -> i32 {
    if balloons.is_empty() {
        return 0;
    }
    let mut b = balloons.to_vec();
    b.sort_by_key(|x| x.1);
    let mut arrows = 1;
    let mut arrow_pos = b[0].1;
    for &(s, e) in &b[1..] {
        if s > arrow_pos {
            arrows += 1;
            arrow_pos = e;
        }
    }
    arrows
}

fn main() {
    assert_eq!(min_arrows(&[(10, 16), (2, 8), (1, 6), (7, 12)]), 2);
    assert_eq!(min_arrows(&[(1, 2), (3, 4), (5, 6), (7, 8)]), 4);
    assert_eq!(min_arrows(&[(1, 2), (2, 3), (3, 4), (4, 5)]), 2);
    assert_eq!(min_arrows(&[]), 0);
    println!("ok");
}`,
    starter: `fn min_arrows(balloons: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_arrows(&[(10, 16), (2, 8), (1, 6), (7, 12)]), 2);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-011',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Meeting Rooms',
    prompt: `Implement:

    fn min_meeting_rooms(intervals: &[(i32, i32)]) -> i32

Given a list of meeting time intervals (start, end), return the minimum number of conference rooms required to schedule all meetings simultaneously.
Example: [(0,30),(5,10),(15,20)] -> 2; [(7,10),(2,4)] -> 1`,
    hints: ['Separate start and end times; sort each independently.', 'Use two pointers to simulate room allocation: increment rooms on each start, decrement on each end that is <= current start.'],
    solution: `fn min_meeting_rooms(intervals: &[(i32, i32)]) -> i32 {
    if intervals.is_empty() {
        return 0;
    }
    let mut starts: Vec<i32> = intervals.iter().map(|x| x.0).collect();
    let mut ends: Vec<i32> = intervals.iter().map(|x| x.1).collect();
    starts.sort();
    ends.sort();
    let mut rooms = 0;
    let mut max_rooms = 0;
    let mut ei = 0;
    for i in 0..starts.len() {
        if starts[i] < ends[ei] {
            rooms += 1;
            if rooms > max_rooms {
                max_rooms = rooms;
            }
        } else {
            ei += 1;
        }
    }
    max_rooms
}

fn main() {
    assert_eq!(min_meeting_rooms(&[(0, 30), (5, 10), (15, 20)]), 2);
    assert_eq!(min_meeting_rooms(&[(7, 10), (2, 4)]), 1);
    assert_eq!(min_meeting_rooms(&[(1, 5), (2, 6), (3, 7)]), 3);
    assert_eq!(min_meeting_rooms(&[]), 0);
    assert_eq!(min_meeting_rooms(&[(1, 4), (4, 8)]), 1);
    println!("ok");
}`,
    starter: `fn min_meeting_rooms(intervals: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_meeting_rooms(&[(0, 30), (5, 10), (15, 20)]), 2);
    assert_eq!(min_meeting_rooms(&[(7, 10), (2, 4)]), 1);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-012',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Interval List Intersections',
    prompt: `Implement:

    fn interval_intersections(a: &[(i32, i32)], b: &[(i32, i32)]) -> Vec<(i32, i32)>

Given two lists of sorted non-overlapping intervals, return their intersection (all intervals that appear in both lists).
An intersection of two intervals [a,b] and [c,d] is [max(a,c), min(b,d)] when max(a,c) <= min(b,d).
Example: a=[(0,2),(5,10)], b=[(1,5),(8,12)] -> [(1,2),(5,5),(8,10)]`,
    hints: ['Use two pointers, one per list.', 'Advance the pointer whose interval ends sooner after each step.'],
    solution: `fn interval_intersections(a: &[(i32, i32)], b: &[(i32, i32)]) -> Vec<(i32, i32)> {
    let mut result = Vec::new();
    let mut i = 0;
    let mut j = 0;
    while i < a.len() && j < b.len() {
        let lo = a[i].0.max(b[j].0);
        let hi = a[i].1.min(b[j].1);
        if lo <= hi {
            result.push((lo, hi));
        }
        if a[i].1 < b[j].1 {
            i += 1;
        } else {
            j += 1;
        }
    }
    result
}

fn main() {
    assert_eq!(
        interval_intersections(&[(0, 2), (5, 10), (13, 23), (24, 25)], &[(1, 5), (8, 12), (15, 24), (25, 26)]),
        vec![(1, 2), (5, 5), (8, 10), (15, 23), (24, 24), (25, 25)]
    );
    assert_eq!(interval_intersections(&[], &[(1, 3)]), vec![]);
    assert_eq!(interval_intersections(&[(1, 3)], &[(4, 6)]), vec![]);
    println!("ok");
}`,
    starter: `fn interval_intersections(a: &[(i32, i32)], b: &[(i32, i32)]) -> Vec<(i32, i32)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(
        interval_intersections(&[(0, 2), (5, 10)], &[(1, 5), (8, 12)]),
        vec![(1, 2), (5, 5), (8, 10)]
    );
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'two pointers'],
  },
  {
    id: 'ds-ch13-c-013',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Jump Game II: Minimum Jumps',
    prompt: `Implement:

    fn jump_min(nums: &[i32]) -> i32

Each element nums[i] is the maximum jump length from index i. Starting at index 0, return the minimum number of jumps to reach the last index.
You are guaranteed to always be able to reach the last index.
Example: [2,3,1,1,4] -> 2; [2,3,0,1,4] -> 2`,
    hints: ['Track the farthest reachable position and the end of the current jump window.', 'Increment the jump count each time you reach the window end and have not yet reached the last index.'],
    solution: `fn jump_min(nums: &[i32]) -> i32 {
    let n = nums.len();
    if n <= 1 {
        return 0;
    }
    let mut jumps = 0;
    let mut current_end = 0usize;
    let mut farthest = 0usize;
    for i in 0..n - 1 {
        let reach = i + nums[i] as usize;
        if reach > farthest {
            farthest = reach;
        }
        if i == current_end {
            jumps += 1;
            current_end = farthest;
            if current_end >= n - 1 {
                break;
            }
        }
    }
    jumps
}

fn main() {
    assert_eq!(jump_min(&[2, 3, 1, 1, 4]), 2);
    assert_eq!(jump_min(&[2, 3, 0, 1, 4]), 2);
    assert_eq!(jump_min(&[1, 1, 1, 1]), 3);
    assert_eq!(jump_min(&[0]), 0);
    assert_eq!(jump_min(&[1]), 0);
    println!("ok");
}`,
    starter: `fn jump_min(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(jump_min(&[2, 3, 1, 1, 4]), 2);
    assert_eq!(jump_min(&[2, 3, 0, 1, 4]), 2);
    println!("ok");
}`,
    tags: ['greedy', 'arrays'],
  },
  {
    id: 'ds-ch13-c-014',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two City Scheduling',
    prompt: `Implement:

    fn two_city_cost(costs: &[(i32, i32)]) -> i32

2n people need to fly to two cities A and B, exactly n to each. costs[i] = (cost_a, cost_b) for person i.
Return the minimum total cost to fly everyone.
Example: [(10,20),(30,200),(400,50),(30,20)] -> 110`,
    hints: ['If everyone goes to city A, the extra cost to send person i to B instead is cost_b - cost_a.', 'Sort by this difference and send the n people with the smallest difference to city A.'],
    solution: `fn two_city_cost(costs: &[(i32, i32)]) -> i32 {
    let n = costs.len();
    let half = n / 2;
    let mut c = costs.to_vec();
    c.sort_by_key(|x| x.0 - x.1);
    let mut total = 0;
    for i in 0..half {
        total += c[i].0;
    }
    for i in half..n {
        total += c[i].1;
    }
    total
}

fn main() {
    assert_eq!(two_city_cost(&[(10, 20), (30, 200), (400, 50), (30, 20)]), 110);
    assert_eq!(two_city_cost(&[(259, 770), (448, 54), (926, 667), (184, 139), (840, 118), (577, 469)]), 1859);
    assert_eq!(two_city_cost(&[(515, 563), (451, 713), (537, 709), (343, 819), (855, 779), (457, 60)]), 2733);
    println!("ok");
}`,
    starter: `fn two_city_cost(costs: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(two_city_cost(&[(10, 20), (30, 200), (400, 50), (30, 20)]), 110);
    println!("ok");
}`,
    tags: ['greedy', 'sorting'],
  },
  {
    id: 'ds-ch13-c-015',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Train Platforms',
    prompt: `Implement:

    fn min_platforms(arrivals: &[i32], departures: &[i32]) -> i32

Given arrival and departure times of trains at a station, return the minimum number of platforms required so no train has to wait.
Times are integers (e.g. 900 means 9:00 AM). A platform is free only after a train departs.
Example: arrivals=[900,940,950,1100,1500,1800], departures=[910,1200,1120,1130,1900,2000] -> 3`,
    hints: ['Sort arrivals and departures separately.', 'Use two pointers: increment platform count on arrival, decrement when a departure is before or equal to the next arrival.'],
    solution: `fn min_platforms(arrivals: &[i32], departures: &[i32]) -> i32 {
    let mut arr = arrivals.to_vec();
    let mut dep = departures.to_vec();
    arr.sort();
    dep.sort();
    let n = arr.len();
    let mut platforms = 0;
    let mut max_platforms = 0;
    let mut i = 0;
    let mut j = 0;
    while i < n && j < n {
        if arr[i] <= dep[j] {
            platforms += 1;
            if platforms > max_platforms {
                max_platforms = platforms;
            }
            i += 1;
        } else {
            platforms -= 1;
            j += 1;
        }
    }
    max_platforms
}

fn main() {
    assert_eq!(min_platforms(&[900, 940, 950, 1100, 1500, 1800], &[910, 1200, 1120, 1130, 1900, 2000]), 3);
    assert_eq!(min_platforms(&[900, 1100, 1235], &[1000, 1200, 1240]), 1);
    assert_eq!(min_platforms(&[100, 200], &[150, 250]), 1);
    assert_eq!(min_platforms(&[100, 150], &[200, 250]), 2);
    println!("ok");
}`,
    starter: `fn min_platforms(arrivals: &[i32], departures: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_platforms(&[900, 940, 950, 1100, 1500, 1800], &[910, 1200, 1120, 1130, 1900, 2000]), 3);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-016',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Maximum Content Children (Greedy Verified)',
    prompt: `Implement:

    fn find_content_children(children_greed: &[i32], cookie_sizes: &[i32]) -> i32

Each child has a minimum greed factor and each cookie has a size. A child is content if they receive a cookie at least as large as their greed factor.
Return the maximum number of content children, each receiving at most one cookie.
Example: children_greed=[1,2,3], cookie_sizes=[1,1] -> 1`,
    hints: ['Sort both arrays ascending.', 'Use a two-pointer sweep matching the smallest available cookie to the least greedy unsatisfied child.'],
    solution: `fn find_content_children(children_greed: &[i32], cookie_sizes: &[i32]) -> i32 {
    let mut g = children_greed.to_vec();
    let mut s = cookie_sizes.to_vec();
    g.sort();
    s.sort();
    let mut gi = 0;
    let mut si = 0;
    while gi < g.len() && si < s.len() {
        if s[si] >= g[gi] {
            gi += 1;
        }
        si += 1;
    }
    gi as i32
}

fn brute_force(children_greed: &[i32], cookie_sizes: &[i32]) -> i32 {
    let n = children_greed.len();
    let m = cookie_sizes.len();
    let mut best = 0i32;
    for mask in 0u64..(1u64 << m) {
        let selected: Vec<i32> = (0..m).filter(|&i| (mask >> i) & 1 == 1).map(|i| cookie_sizes[i]).collect();
        if selected.len() > n {
            continue;
        }
        let mut g = children_greed.to_vec();
        let mut s = selected.to_vec();
        g.sort();
        s.sort();
        let mut count = 0;
        let mut gi = 0;
        let mut si = 0;
        while gi < g.len() && si < s.len() {
            if s[si] >= g[gi] {
                gi += 1;
                count += 1;
            }
            si += 1;
        }
        if count > best {
            best = count;
        }
    }
    best
}

fn main() {
    let tc = vec![
        (vec![1, 2, 3], vec![1, 1]),
        (vec![1, 2], vec![1, 2, 3]),
        (vec![10, 9, 8, 7], vec![5, 6, 7, 8]),
    ];
    for (g, s) in &tc {
        assert_eq!(find_content_children(g, s), brute_force(g, s),
            "mismatch for g={:?} s={:?}", g, s);
    }
    assert_eq!(find_content_children(&[], &[1, 2]), 0);
    println!("ok");
}`,
    starter: `fn find_content_children(children_greed: &[i32], cookie_sizes: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_content_children(&[1, 2, 3], &[1, 1]), 1);
    assert_eq!(find_content_children(&[1, 2], &[1, 2, 3]), 2);
    println!("ok");
}`,
    tags: ['greedy', 'sorting', 'two pointers'],
  },
  {
    id: 'ds-ch13-c-017',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Non-Overlapping Interval Count (Brute Verified)',
    prompt: `Implement:

    fn non_overlapping_count(intervals: &[(i32, i32)]) -> i32

Return the minimum number of intervals to remove so that the remaining intervals are non-overlapping.
Intervals sharing only an endpoint are not considered overlapping.
Example: [(1,2),(2,3),(3,4),(1,3)] -> 1`,
    hints: ['Sort by end time and greedily keep every interval that starts at or after the last kept end.', 'The answer is total count minus kept count.'],
    solution: `fn non_overlapping_count(intervals: &[(i32, i32)]) -> i32 {
    if intervals.is_empty() {
        return 0;
    }
    let mut iv = intervals.to_vec();
    iv.sort_by_key(|x| x.1);
    let mut keep = 0;
    let mut last_end = i32::MIN;
    for (s, e) in &iv {
        if *s >= last_end {
            keep += 1;
            last_end = *e;
        }
    }
    (intervals.len() as i32) - keep
}

fn brute_force(intervals: &[(i32, i32)]) -> i32 {
    let n = intervals.len();
    let mut best_keep = 0;
    for mask in 0u32..(1u32 << n) {
        let selected: Vec<(i32, i32)> = (0..n).filter(|&i| (mask >> i) & 1 == 1).map(|i| intervals[i]).collect();
        let mut sorted = selected.clone();
        sorted.sort();
        let mut ok = true;
        for i in 1..sorted.len() {
            if sorted[i].0 < sorted[i - 1].1 {
                ok = false;
                break;
            }
        }
        if ok && selected.len() > best_keep {
            best_keep = selected.len();
        }
    }
    (n as i32) - best_keep as i32
}

fn main() {
    let tcs = vec![
        vec![(1, 2), (2, 3), (3, 4), (1, 3)],
        vec![(1, 2), (1, 2), (1, 2)],
        vec![(1, 2), (2, 3)],
    ];
    for tc in &tcs {
        assert_eq!(non_overlapping_count(tc), brute_force(tc),
            "mismatch for {:?}", tc);
    }
    assert_eq!(non_overlapping_count(&[]), 0);
    println!("ok");
}`,
    starter: `fn non_overlapping_count(intervals: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(non_overlapping_count(&[(1, 2), (2, 3), (3, 4), (1, 3)]), 1);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-018',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Balloon Burst Arrow Count with Edge Values',
    prompt: `Implement:

    fn min_arrows(balloons: &[(i32, i32)]) -> i32

Each balloon occupies a horizontal range [start, end] on the x-axis. An arrow at position x bursts every balloon where start <= x <= end.
Return the minimum number of vertical arrows to burst all balloons.
Handle large coordinate values (up to i32::MAX and i32::MIN).
Example: [(10,16),(2,8),(1,6),(7,12)] -> 2`,
    hints: ['Sort by end coordinate to process the soonest-ending balloon first.', 'Shoot at the current end; any balloon that overlaps is also burst. Only start a new arrow when the next balloon starts after the current shot.'],
    solution: `fn min_arrows(balloons: &[(i32, i32)]) -> i32 {
    if balloons.is_empty() {
        return 0;
    }
    let mut b = balloons.to_vec();
    b.sort_by_key(|x| x.1);
    let mut arrows = 1;
    let mut pos = b[0].1;
    for &(s, e) in &b[1..] {
        if s > pos {
            arrows += 1;
            pos = e;
        }
    }
    arrows
}

fn main() {
    assert_eq!(min_arrows(&[(10, 16), (2, 8), (1, 6), (7, 12)]), 2);
    assert_eq!(min_arrows(&[(1, 2), (3, 4), (5, 6), (7, 8)]), 4);
    assert_eq!(min_arrows(&[(1, 2), (2, 3), (3, 4), (4, 5)]), 2);
    assert_eq!(min_arrows(&[]), 0);
    assert_eq!(min_arrows(&[(-2147483646, -2147483645), (2147483646, 2147483647)]), 2);
    println!("ok");
}`,
    starter: `fn min_arrows(balloons: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_arrows(&[(10, 16), (2, 8), (1, 6), (7, 12)]), 2);
    assert_eq!(min_arrows(&[(1, 2), (3, 4), (5, 6), (7, 8)]), 4);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-019',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Car Pooling Feasibility',
    prompt: `Implement:

    fn car_pooling(trips: &[(i32, i32, i32)], capacity: i32) -> bool

A car with capacity seats makes trips. Each trip is (num_passengers, from_km, to_km). Passengers board at from_km and alight at to_km.
Return true if it is possible to complete all trips without exceeding capacity at any point.
Example: trips=[(2,1,5),(3,3,7)], capacity=4 -> false; capacity=5 -> true`,
    hints: ['Model as a sweep-line over distance: add passengers at from, remove at to.', 'Sort events and check cumulative count never exceeds capacity.'],
    solution: `fn car_pooling(trips: &[(i32, i32, i32)], capacity: i32) -> bool {
    let mut events: Vec<(i32, i32)> = Vec::new();
    for &(passengers, from, to) in trips {
        events.push((from, passengers));
        events.push((to, -passengers));
    }
    events.sort();
    let mut current = 0;
    for (_, delta) in events {
        current += delta;
        if current > capacity {
            return false;
        }
    }
    true
}

fn main() {
    assert_eq!(car_pooling(&[(2, 1, 5), (3, 3, 7)], 4), false);
    assert_eq!(car_pooling(&[(2, 1, 5), (3, 3, 7)], 5), true);
    assert_eq!(car_pooling(&[(2, 1, 5), (3, 5, 7)], 3), true);
    assert_eq!(car_pooling(&[(3, 2, 7), (3, 7, 9), (8, 3, 9)], 11), true);
    assert_eq!(car_pooling(&[], 5), true);
    println!("ok");
}`,
    starter: `fn car_pooling(trips: &[(i32, i32, i32)], capacity: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(car_pooling(&[(2, 1, 5), (3, 3, 7)], 4), false);
    assert_eq!(car_pooling(&[(2, 1, 5), (3, 3, 7)], 5), true);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sweep line'],
  },
  {
    id: 'ds-ch13-c-020',
    chapter: 13,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Task Scheduler Minimum Intervals',
    prompt: `Implement:

    fn task_scheduler(tasks: &[char], n: i32) -> i32

You have CPU tasks labeled A-Z. Between two tasks with the same label there must be at least n idle slots.
Return the minimum number of intervals (including idle slots) needed to finish all tasks.
Example: tasks=[A,A,A,B,B,B], n=2 -> 8 (ABABAC_); tasks with n=0 -> 6`,
    hints: ['The bottleneck is the most frequent task. Compute (max_freq - 1) * (n + 1) + count_of_tasks_with_max_freq.', 'The answer is at least the total number of tasks (when tasks are varied enough to fill all slots).'],
    solution: `fn task_scheduler(tasks: &[char], n: i32) -> i32 {
    let mut freq = [0i32; 26];
    for &t in tasks {
        freq[(t as u8 - b'A') as usize] += 1;
    }
    freq.sort();
    let max_freq = freq[25];
    let max_count = freq.iter().filter(|&&f| f == max_freq).count() as i32;
    let result = (max_freq - 1) * (n + 1) + max_count;
    result.max(tasks.len() as i32)
}

fn main() {
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'D', 'D', 'E'], 2), 12);
    assert_eq!(task_scheduler(&['A'], 5), 1);
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E'], 2), 12);
    println!("ok");
}`,
    starter: `fn task_scheduler(tasks: &[char], n: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
    assert_eq!(task_scheduler(&['A', 'A', 'A', 'B', 'B', 'B'], 0), 6);
    println!("ok");
}`,
    tags: ['greedy', 'frequency', 'scheduling'],
  },
  {
    id: 'ds-ch13-c-021',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Candy Distribution Minimum',
    prompt: `Implement:

    fn candy(ratings: &[i32]) -> i32

Give each of n children at least 1 candy. Children with a higher rating than an adjacent neighbor must receive more candies than that neighbor.
Return the minimum total number of candies needed.
Example: [1,0,2] -> 5; [1,2,2] -> 4`,
    hints: ['Do a left-to-right pass: if ratings[i] > ratings[i-1], give one more than the left neighbor.', 'Do a right-to-left pass: if ratings[i] > ratings[i+1] and current candy count is not already higher, update it.'],
    solution: `fn candy(ratings: &[i32]) -> i32 {
    let n = ratings.len();
    if n == 0 {
        return 0;
    }
    let mut candies = vec![1i32; n];
    for i in 1..n {
        if ratings[i] > ratings[i - 1] {
            candies[i] = candies[i - 1] + 1;
        }
    }
    for i in (0..n - 1).rev() {
        if ratings[i] > ratings[i + 1] && candies[i] <= candies[i + 1] {
            candies[i] = candies[i + 1] + 1;
        }
    }
    candies.iter().sum()
}

fn main() {
    assert_eq!(candy(&[1, 0, 2]), 5);
    assert_eq!(candy(&[1, 2, 2]), 4);
    assert_eq!(candy(&[1, 3, 2, 2, 1]), 7);
    assert_eq!(candy(&[1]), 1);
    assert_eq!(candy(&[1, 2, 3, 2, 1]), 9);
    assert_eq!(candy(&[5, 4, 3, 2, 1]), 15);
    println!("ok");
}`,
    starter: `fn candy(ratings: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(candy(&[1, 0, 2]), 5);
    assert_eq!(candy(&[1, 2, 2]), 4);
    println!("ok");
}`,
    tags: ['greedy', 'arrays', 'two pass'],
  },
  {
    id: 'ds-ch13-c-022',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum Events Attended',
    prompt: `Implement:

    fn max_events(events: &[(i32, i32)]) -> i32

Each event is a (start_day, end_day) interval. You can attend one event per day; you may attend any one day within [start_day, end_day].
Return the maximum number of events you can attend.
Example: [(1,2),(2,3),(3,4)] -> 3; [(1,1),(1,1)] -> 1`,
    hints: ['Sort events by start day.', 'Use a min-heap of end days. Each day, add all events starting that day, pop expired ones, then attend the event with the soonest end.'],
    solution: `use std::collections::BinaryHeap;

fn max_events(events: &[(i32, i32)]) -> i32 {
    let mut evs = events.to_vec();
    evs.sort();
    let mut attended = 0;
    let mut heap: BinaryHeap<std::cmp::Reverse<i32>> = BinaryHeap::new();
    let mut i = 0;
    let n = evs.len();
    let max_day = evs.iter().map(|e| e.1).max().unwrap_or(0);
    for day in 1..=max_day {
        while i < n && evs[i].0 == day {
            heap.push(std::cmp::Reverse(evs[i].1));
            i += 1;
        }
        while let Some(&std::cmp::Reverse(end)) = heap.peek() {
            if end < day {
                heap.pop();
            } else {
                break;
            }
        }
        if !heap.is_empty() {
            heap.pop();
            attended += 1;
        }
    }
    attended
}

fn main() {
    assert_eq!(max_events(&[(1, 2), (2, 3), (3, 4)]), 3);
    assert_eq!(max_events(&[(1, 2), (2, 2), (3, 3), (1, 5), (1, 5)]), 5);
    assert_eq!(max_events(&[(1, 4), (4, 4), (2, 2), (3, 4), (1, 1)]), 4);
    assert_eq!(max_events(&[(1, 1), (1, 2), (1, 3), (1, 4), (1, 5)]), 5);
    assert_eq!(max_events(&[(1, 1), (1, 1)]), 1);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn max_events(events: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_events(&[(1, 2), (2, 3), (3, 4)]), 3);
    assert_eq!(max_events(&[(1, 1), (1, 1)]), 1);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'heap', 'scheduling'],
  },
  {
    id: 'ds-ch13-c-023',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Employee Free Time',
    prompt: `Implement:

    fn employee_free_time(schedules: &[Vec<(i32, i32)>]) -> Vec<(i32, i32)>

Given each employee a sorted list of working intervals, find all free-time intervals common to all employees (gaps in the union of all working intervals).
Return these free intervals sorted by start. A free interval is a gap between the end of one block and the start of the next in the merged schedule.
Example: schedules=[[(1,3),(6,7)],[(2,4)],[(2,5),(9,12)]] -> [(5,6),(7,9)]`,
    hints: ['Merge all working intervals across all employees into one sorted list.', 'Scan consecutive merged intervals; any gap between them is free time.'],
    solution: `fn employee_free_time(schedules: &[Vec<(i32, i32)>]) -> Vec<(i32, i32)> {
    let mut all_intervals: Vec<(i32, i32)> = schedules.iter().flat_map(|s| s.iter().cloned()).collect();
    all_intervals.sort();
    let mut merged: Vec<(i32, i32)> = Vec::new();
    for (s, e) in all_intervals {
        if let Some(last) = merged.last_mut() {
            if s <= last.1 {
                last.1 = last.1.max(e);
                continue;
            }
        }
        merged.push((s, e));
    }
    let mut free = Vec::new();
    for w in merged.windows(2) {
        if w[0].1 < w[1].0 {
            free.push((w[0].1, w[1].0));
        }
    }
    free
}

fn main() {
    let s1 = vec![vec![(1, 3), (6, 7)], vec![(2, 4)], vec![(2, 5), (9, 12)]];
    assert_eq!(employee_free_time(&s1), vec![(5, 6), (7, 9)]);

    let s2 = vec![vec![(1, 3), (9, 12)], vec![(2, 4)], vec![(6, 8)]];
    assert_eq!(employee_free_time(&s2), vec![(4, 6), (8, 9)]);

    let s3 = vec![vec![(1, 2)], vec![(3, 4)]];
    assert_eq!(employee_free_time(&s3), vec![(2, 3)]);
    println!("ok");
}`,
    starter: `fn employee_free_time(schedules: &[Vec<(i32, i32)>]) -> Vec<(i32, i32)> {
    // TODO
    todo!()
}

fn main() {
    let s = vec![vec![(1, 3), (6, 7)], vec![(2, 4)], vec![(2, 5), (9, 12)]];
    assert_eq!(employee_free_time(&s), vec![(5, 6), (7, 9)]);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'merge', 'hard'],
  },
  {
    id: 'ds-ch13-c-024',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Number of Taps to Water a Garden',
    prompt: `Implement:

    fn min_taps(n: i32, ranges: &[i32]) -> i32

A garden spans [0, n]. There are n+1 taps at positions 0..n, each with a range so tap i waters [i-ranges[i], i+ranges[i]].
Return the minimum number of taps to open to water the entire garden, or -1 if impossible.
Example: n=5, ranges=[3,4,1,1,0,0] -> 1; n=3, ranges=[0,0,0,0] -> -1`,
    hints: ['Convert each tap to a coverage interval, then reduce to the jump-game-II problem on position 0..n.', 'For each left endpoint, track the farthest right reachable; greedily extend coverage.'],
    solution: `fn min_taps(n: i32, ranges: &[i32]) -> i32 {
    let n = n as usize;
    let mut jump = vec![0usize; n + 1];
    for i in 0..=n {
        let r = ranges[i] as usize;
        let left = if i >= r { i - r } else { 0 };
        let right = (i + r).min(n);
        if right > jump[left] {
            jump[left] = right;
        }
    }
    let mut taps = 0;
    let mut cur_end = 0;
    let mut farthest = 0;
    for i in 0..=n {
        if i > farthest {
            return -1;
        }
        if jump[i] > farthest {
            farthest = jump[i];
        }
        if i == cur_end && i < n {
            taps += 1;
            cur_end = farthest;
        }
    }
    taps
}

fn main() {
    assert_eq!(min_taps(5, &[3, 4, 1, 1, 0, 0]), 1);
    assert_eq!(min_taps(3, &[0, 0, 0, 0]), -1);
    assert_eq!(min_taps(7, &[1, 2, 1, 0, 2, 1, 0, 1]), 3);
    assert_eq!(min_taps(0, &[0]), 0);
    println!("ok");
}`,
    starter: `fn min_taps(n: i32, ranges: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_taps(5, &[3, 4, 1, 1, 0, 0]), 1);
    assert_eq!(min_taps(3, &[0, 0, 0, 0]), -1);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'jump game'],
  },
  {
    id: 'ds-ch13-c-025',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Video Stitching',
    prompt: `Implement:

    fn video_stitching(clips: &[(i32, i32)], t: i32) -> i32

You want to cover the video range [0, t] using clips. Each clip is a (start, end) subrange.
Return the minimum number of clips needed to cover [0, t], or -1 if impossible.
Example: clips=[(0,2),(4,6),(8,10),(1,9),(1,5),(5,9)], t=10 -> 3`,
    hints: ['For each position, precompute the farthest reachable end from clips starting there.', 'Apply the jump game greedy: at each position advance farthest, and count when you must extend.'],
    solution: `fn video_stitching(clips: &[(i32, i32)], t: i32) -> i32 {
    let t = t as usize;
    let mut max_reach = vec![0usize; t + 1];
    for &(s, e) in clips {
        if s as usize <= t {
            let reach = (e as usize).min(t);
            if reach > max_reach[s as usize] {
                max_reach[s as usize] = reach;
            }
        }
    }
    let mut count = 0;
    let mut cur_end = 0;
    let mut farthest = 0;
    for i in 0..=t {
        if i > farthest {
            return -1;
        }
        if max_reach[i] > farthest {
            farthest = max_reach[i];
        }
        if i == cur_end && i < t {
            count += 1;
            cur_end = farthest;
        }
    }
    count
}

fn main() {
    assert_eq!(video_stitching(&[(0, 2), (4, 6), (8, 10), (1, 9), (1, 5), (5, 9)], 10), 3);
    assert_eq!(video_stitching(&[(0, 1), (1, 2)], 5), -1);
    assert_eq!(video_stitching(&[(0, 1), (6, 8), (0, 2), (5, 6), (0, 4), (0, 3), (6, 7), (1, 3), (4, 7), (1, 4), (2, 5), (2, 6), (3, 4), (4, 5), (5, 7), (6, 9)], 9), 3);
    assert_eq!(video_stitching(&[(0, 5)], 5), 1);
    println!("ok");
}`,
    starter: `fn video_stitching(clips: &[(i32, i32)], t: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(video_stitching(&[(0, 2), (4, 6), (8, 10), (1, 9), (1, 5), (5, 9)], 10), 3);
    assert_eq!(video_stitching(&[(0, 1), (1, 2)], 5), -1);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'jump game'],
  },
  {
    id: 'ds-ch13-c-026',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Job Scheduling for Maximum Profit',
    prompt: `Implement:

    fn max_profit_job_scheduling(jobs: &[(i32, i32, i32)]) -> i32

Each job is (start, end, profit). You may not hold two overlapping jobs simultaneously. Return the maximum profit achievable.
Example: [(1,2,50),(3,5,20),(6,19,100),(2,100,200)] -> 250`,
    hints: ['Sort by end time; define dp[i] = max profit using only jobs ending at or before job i.', 'For each job, binary search for the latest non-overlapping job, then dp[i] = max(dp[i-1], dp[j] + profit[i]).'],
    solution: `fn max_profit_job_scheduling(jobs: &[(i32, i32, i32)]) -> i32 {
    let mut sorted = jobs.to_vec();
    sorted.sort_by_key(|j| j.1);
    let n = sorted.len();
    let mut dp = vec![0i32; n + 1];
    for i in 1..=n {
        let (start, _end, profit) = sorted[i - 1];
        let mut lo = 0;
        let mut hi = i - 1;
        while lo < hi {
            let mid = (lo + hi + 1) / 2;
            if sorted[mid - 1].1 <= start {
                lo = mid;
            } else {
                hi = mid - 1;
            }
        }
        dp[i] = dp[i - 1].max(dp[lo] + profit);
    }
    dp[n]
}

fn main() {
    assert_eq!(max_profit_job_scheduling(&[(1, 2, 50), (3, 5, 20), (6, 19, 100), (2, 100, 200)]), 250);
    assert_eq!(max_profit_job_scheduling(&[(1, 3, 20), (2, 5, 20), (3, 10, 100), (4, 6, 70), (6, 9, 60)]), 150);
    assert_eq!(max_profit_job_scheduling(&[(1, 2, 10), (2, 3, 20), (3, 4, 30)]), 60);
    assert_eq!(max_profit_job_scheduling(&[(1, 10, 5)]), 5);
    println!("ok");
}`,
    starter: `fn max_profit_job_scheduling(jobs: &[(i32, i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_profit_job_scheduling(&[(1, 2, 50), (3, 5, 20), (6, 19, 100), (2, 100, 200)]), 250);
    println!("ok");
}`,
    tags: ['greedy', 'binary search', 'dp', 'intervals'],
  },
  {
    id: 'ds-ch13-c-027',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Queue Reconstruction by Height',
    prompt: `Implement:

    fn reconstruct_queue(people: &[(i32, i32)]) -> Vec<(i32, i32)>

Each person is described by (height, k) where k is the number of people in front with height >= their own.
Return a reordering of people that satisfies all k-constraints.
Example: [(7,0),(4,4),(7,1),(5,0),(6,1),(5,2)] -> [(5,0),(7,0),(5,2),(6,1),(4,4),(7,1)]`,
    hints: ['Sort by height descending, breaking ties by k ascending.', 'Insert each person at index k into the result list; taller people already placed will not be displaced by shorter insertions.'],
    solution: `fn reconstruct_queue(people: &[(i32, i32)]) -> Vec<(i32, i32)> {
    let mut people = people.to_vec();
    people.sort_by(|a, b| {
        if a.0 != b.0 {
            b.0.cmp(&a.0)
        } else {
            a.1.cmp(&b.1)
        }
    });
    let mut result: Vec<(i32, i32)> = Vec::new();
    for p in people {
        result.insert(p.1 as usize, p);
    }
    result
}

fn main() {
    assert_eq!(
        reconstruct_queue(&[(7, 0), (4, 4), (7, 1), (5, 0), (6, 1), (5, 2)]),
        vec![(5, 0), (7, 0), (5, 2), (6, 1), (4, 4), (7, 1)]
    );
    assert_eq!(
        reconstruct_queue(&[(6, 0), (5, 0), (4, 0), (3, 2), (2, 2), (1, 4)]),
        vec![(4, 0), (5, 0), (2, 2), (3, 2), (1, 4), (6, 0)]
    );
    assert_eq!(reconstruct_queue(&[(1, 0)]), vec![(1, 0)]);
    println!("ok");
}`,
    starter: `fn reconstruct_queue(people: &[(i32, i32)]) -> Vec<(i32, i32)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(
        reconstruct_queue(&[(7, 0), (4, 4), (7, 1), (5, 0), (6, 1), (5, 2)]),
        vec![(5, 0), (7, 0), (5, 2), (6, 1), (4, 4), (7, 1)]
    );
    println!("ok");
}`,
    tags: ['greedy', 'sorting', 'insertion'],
  },
  {
    id: 'ds-ch13-c-028',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Split Array Largest Sum',
    prompt: `Implement:

    fn split_array_largest_sum(nums: &[i32], k: i32) -> i32

Split non-negative integer array nums into k non-empty contiguous subarrays. Minimize the largest subarray sum.
Example: nums=[7,2,5,10,8], k=2 -> 18; nums=[1,2,3,4,5], k=2 -> 9`,
    hints: ['Binary search on the answer between max(nums) and sum(nums).', 'For a candidate maximum, greedily check if you can split into at most k parts each with sum <= candidate.'],
    solution: `fn split_array_largest_sum(nums: &[i32], k: i32) -> i32 {
    let can_split = |mid: i64| -> bool {
        let mut parts = 1i32;
        let mut current = 0i64;
        for &n in nums {
            if current + n as i64 > mid {
                parts += 1;
                current = n as i64;
                if parts > k {
                    return false;
                }
            } else {
                current += n as i64;
            }
        }
        true
    };
    let mut lo = *nums.iter().max().unwrap() as i64;
    let mut hi: i64 = nums.iter().map(|&x| x as i64).sum();
    while lo < hi {
        let mid = (lo + hi) / 2;
        if can_split(mid) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    lo as i32
}

fn main() {
    assert_eq!(split_array_largest_sum(&[7, 2, 5, 10, 8], 2), 18);
    assert_eq!(split_array_largest_sum(&[1, 2, 3, 4, 5], 2), 9);
    assert_eq!(split_array_largest_sum(&[1, 4, 4], 3), 4);
    assert_eq!(split_array_largest_sum(&[10], 1), 10);
    println!("ok");
}`,
    starter: `fn split_array_largest_sum(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(split_array_largest_sum(&[7, 2, 5, 10, 8], 2), 18);
    assert_eq!(split_array_largest_sum(&[1, 2, 3, 4, 5], 2), 9);
    println!("ok");
}`,
    tags: ['binary search', 'greedy', 'arrays'],
  },
  {
    id: 'ds-ch13-c-029',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Arrows with Shot Positions',
    prompt: `Implement:

    fn find_min_arrow_with_order(balloons: &[(i32, i32)]) -> (i32, Vec<i32>)

Like the minimum-arrows problem, but also return the exact x-positions where each arrow is shot.
Sort balloons by end coordinate and shoot each new arrow at the end of the earliest unpopped balloon.
Return (arrow_count, sorted_positions).
Example: [(10,16),(2,8),(1,6),(7,12)] -> (2, [6, 16]) or equivalent valid answer`,
    hints: ['Sort by end; shoot at b[0].end, then skip any balloon already hit.', 'Every time you need a new arrow, record b[i].end as the new shot position.'],
    solution: `fn find_min_arrow_with_order(balloons: &[(i32, i32)]) -> (i32, Vec<i32>) {
    if balloons.is_empty() {
        return (0, vec![]);
    }
    let mut b = balloons.to_vec();
    b.sort_by_key(|x| x.1);
    let mut arrows = Vec::new();
    let mut pos = b[0].1;
    arrows.push(pos);
    for &(s, e) in &b[1..] {
        if s > pos {
            pos = e;
            arrows.push(pos);
        }
    }
    (arrows.len() as i32, arrows)
}

fn verify_arrows(balloons: &[(i32, i32)], arrow_positions: &[i32]) -> bool {
    for &(s, e) in balloons {
        if !arrow_positions.iter().any(|&p| p >= s && p <= e) {
            return false;
        }
    }
    true
}

fn main() {
    let tc1 = vec![(10i32, 16i32), (2, 8), (1, 6), (7, 12)];
    let (count1, pos1) = find_min_arrow_with_order(&tc1);
    assert_eq!(count1, 2);
    assert!(verify_arrows(&tc1, &pos1));

    let tc2 = vec![(1, 2), (3, 4), (5, 6), (7, 8)];
    let (count2, pos2) = find_min_arrow_with_order(&tc2);
    assert_eq!(count2, 4);
    assert!(verify_arrows(&tc2, &pos2));

    let tc3 = vec![(1, 2), (2, 3), (3, 4), (4, 5)];
    let (count3, pos3) = find_min_arrow_with_order(&tc3);
    assert_eq!(count3, 2);
    assert!(verify_arrows(&tc3, &pos3));

    let (count4, _) = find_min_arrow_with_order(&[]);
    assert_eq!(count4, 0);
    println!("ok");
}`,
    starter: `fn find_min_arrow_with_order(balloons: &[(i32, i32)]) -> (i32, Vec<i32>) {
    // TODO
    todo!()
}

fn main() {
    let tc = vec![(10i32, 16i32), (2, 8), (1, 6), (7, 12)];
    let (count, _pos) = find_min_arrow_with_order(&tc);
    assert_eq!(count, 2);
    println!("ok");
}`,
    tags: ['greedy', 'intervals', 'sorting'],
  },
  {
    id: 'ds-ch13-c-030',
    chapter: 13,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum Events Attended II',
    prompt: `Implement:

    fn max_events_ii(events: &[(i32, i32, i32)], k: i32) -> i32

Each event is (start, end, value). You may attend at most k non-overlapping events (no two share a day).
Return the maximum total value.
Example: events=[(1,2,4),(3,4,3),(2,3,1)], k=2 -> 7; [(1,2,4),(3,4,3),(2,3,10)], k=2 -> 10`,
    hints: ['Sort events by start; use dp[i][j] = best value attending j events from event i onward.', 'For each event, binary search for the next event that starts after the current event ends, then choose to attend or skip.'],
    solution: `fn max_events_ii(events: &[(i32, i32, i32)], k: i32) -> i32 {
    let mut evs = events.to_vec();
    evs.sort();
    let n = evs.len();
    let k = k as usize;
    let mut dp = vec![vec![0i32; k + 1]; n + 1];
    for i in (0..n).rev() {
        let (start, end, value) = evs[i];
        let next = evs[i..].partition_point(|&(s, _, _)| s <= end) + i;
        for j in 1..=k {
            dp[i][j] = dp[i + 1][j].max(value + dp[next][j - 1]);
        }
    }
    dp[0][k]
}

fn main() {
    assert_eq!(max_events_ii(&[(1, 2, 4), (3, 4, 3), (2, 3, 1)], 2), 7);
    assert_eq!(max_events_ii(&[(1, 2, 4), (3, 4, 3), (2, 3, 10)], 2), 10);
    assert_eq!(max_events_ii(&[(1, 1, 1), (2, 2, 2), (3, 3, 3), (4, 4, 4), (5, 5, 5)], 3), 12);
    assert_eq!(max_events_ii(&[(1, 5, 3), (1, 5, 1), (6, 6, 5)], 2), 8);
    println!("ok");
}`,
    starter: `fn max_events_ii(events: &[(i32, i32, i32)], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_events_ii(&[(1, 2, 4), (3, 4, 3), (2, 3, 1)], 2), 7);
    assert_eq!(max_events_ii(&[(1, 2, 4), (3, 4, 3), (2, 3, 10)], 2), 10);
    println!("ok");
}`,
    tags: ['dp', 'greedy', 'binary search', 'intervals'],
  },
]

export default problems
