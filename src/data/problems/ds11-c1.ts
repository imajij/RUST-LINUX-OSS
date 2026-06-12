import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch11-c-001',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'BFS Traversal Order',
    prompt: `Implement:

    fn bfs_order(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize>

Given an undirected graph with n nodes (0-indexed) as an adjacency list, return the nodes visited in BFS order starting from start. Return an empty vector when n == 0.
Example: n=4, adj=[[1,2],[0,3],[0,3],[1,2]], start=0 -> [0,1,2,3]`,
    hints: [
      'Use a VecDeque as the BFS queue; push start, mark it visited.',
      'Pop front, record the node, then enqueue all unvisited neighbors.',
    ],
    solution: `use std::collections::VecDeque;

fn bfs_order(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    if n == 0 { return vec![]; }
    let mut visited = vec![false; n];
    let mut order = Vec::new();
    visited[start] = true;
    let mut q = VecDeque::new();
    q.push_back(start);
    while let Some(node) = q.pop_front() {
        order.push(node);
        for &nb in &adj[node] {
            if !visited[nb] {
                visited[nb] = true;
                q.push_back(nb);
            }
        }
    }
    order
}

fn main() {
    let adj = vec![vec![1,2], vec![0,3], vec![0,3], vec![1,2]];
    assert_eq!(bfs_order(4, &adj, 0), vec![0,1,2,3]);
    let adj2: Vec<Vec<usize>> = vec![vec![]];
    assert_eq!(bfs_order(1, &adj2, 0), vec![0]);
    assert_eq!(bfs_order(0, &vec![], 0), vec![]);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn bfs_order(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(bfs_order(0, &vec![], 0), vec![]);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'traversal'],
  },
  {
    id: 'ds-ch11-c-002',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'DFS Traversal Order',
    prompt: `Implement:

    fn dfs_order(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize>

Given an undirected graph with n nodes as an adjacency list, return all nodes visited in iterative DFS order from start. Return an empty vector when n == 0.
Example: n=4, adj=[[1,2],[0,3],[0,3],[1,2]], start=0 -> starts with 0 and contains all 4 nodes.`,
    hints: [
      'Use an explicit Vec as the DFS stack; push start and mark it visited before pushing.',
      'To match a specific neighbor order, iterate neighbors in reverse before pushing.',
    ],
    solution: `fn dfs_order(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    let mut visited = vec![false; n];
    let mut order = Vec::new();
    if n == 0 { return order; }
    let mut stack = vec![start];
    visited[start] = true;
    while let Some(node) = stack.pop() {
        order.push(node);
        for &nb in adj[node].iter().rev() {
            if !visited[nb] {
                visited[nb] = true;
                stack.push(nb);
            }
        }
    }
    order
}

fn main() {
    let adj = vec![vec![1,2], vec![0,3], vec![0,3], vec![1,2]];
    let res = dfs_order(4, &adj, 0);
    assert_eq!(res[0], 0);
    assert!(res.contains(&1));
    assert!(res.contains(&2));
    assert!(res.contains(&3));
    assert_eq!(res.len(), 4);
    assert_eq!(dfs_order(0, &vec![], 0), vec![]);
    println!("ok");
}`,
    starter: `fn dfs_order(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(dfs_order(0, &vec![], 0), vec![]);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'traversal'],
  },
  {
    id: 'ds-ch11-c-003',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Connected Components',
    prompt: `Implement:

    fn count_components(n: usize, edges: &[(usize, usize)]) -> usize

Given n nodes (0-indexed) and an undirected edge list, return the number of connected components. Return 0 when n == 0.
Example: n=5, edges=[(0,1),(1,2),(3,4)] -> 2`,
    hints: [
      'Build an adjacency list from the edge list, then iterate nodes.',
      'Each time you find an unvisited node, increment count and DFS/BFS to mark its component.',
    ],
    solution: `fn count_components(n: usize, edges: &[(usize, usize)]) -> usize {
    if n == 0 { return 0; }
    let mut adj = vec![vec![]; n];
    for &(u, v) in edges {
        adj[u].push(v);
        adj[v].push(u);
    }
    let mut visited = vec![false; n];
    let mut count = 0;
    for i in 0..n {
        if !visited[i] {
            count += 1;
            let mut stack = vec![i];
            visited[i] = true;
            while let Some(node) = stack.pop() {
                for &nb in &adj[node] {
                    if !visited[nb] {
                        visited[nb] = true;
                        stack.push(nb);
                    }
                }
            }
        }
    }
    count
}

fn main() {
    assert_eq!(count_components(5, &[(0,1),(1,2),(3,4)]), 2);
    assert_eq!(count_components(4, &[]), 4);
    assert_eq!(count_components(1, &[]), 1);
    assert_eq!(count_components(0, &[]), 0);
    assert_eq!(count_components(3, &[(0,1),(1,2),(0,2)]), 1);
    println!("ok");
}`,
    starter: `fn count_components(n: usize, edges: &[(usize, usize)]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_components(0, &[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'connected-components'],
  },
  {
    id: 'ds-ch11-c-004',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Number of Islands',
    prompt: `Implement:

    fn num_islands(grid: &[Vec<u8>]) -> i32

Each cell is 1 (land) or 0 (water). An island is a maximal group of 1s connected up/down/left/right. Return the total count. Return 0 for an empty grid.
Example: [[1,1,0],[0,1,0],[0,0,1]] -> 2`,
    hints: [
      'Scan every cell; when you find an unvisited 1, increment count and flood-fill it.',
      'Use wrapping_sub(1) for the upward/leftward neighbor, then guard with < rows/cols.',
    ],
    solution: `fn num_islands(grid: &[Vec<u8>]) -> i32 {
    let rows = grid.len();
    if rows == 0 { return 0; }
    let cols = grid[0].len();
    let mut seen = vec![vec![false; cols]; rows];
    let mut count = 0;
    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == 1 && !seen[r][c] {
                count += 1;
                let mut stack = vec![(r, c)];
                seen[r][c] = true;
                while let Some((y, x)) = stack.pop() {
                    let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
                    for (ny, nx) in cands {
                        if ny < rows && nx < cols && grid[ny][nx] == 1 && !seen[ny][nx] {
                            seen[ny][nx] = true;
                            stack.push((ny, nx));
                        }
                    }
                }
            }
        }
    }
    count
}

fn main() {
    let g = vec![vec![1u8,1,0], vec![0,1,0], vec![0,0,1]];
    assert_eq!(num_islands(&g), 2);
    assert_eq!(num_islands(&[]), 0);
    let g2 = vec![vec![0u8,0], vec![0,0]];
    assert_eq!(num_islands(&g2), 0);
    let g3 = vec![vec![1u8,1], vec![1,1]];
    assert_eq!(num_islands(&g3), 1);
    println!("ok");
}`,
    starter: `fn num_islands(grid: &[Vec<u8>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(num_islands(&[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'bfs-dfs', 'grid'],
  },
  {
    id: 'ds-ch11-c-005',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Flood Fill',
    prompt: `Implement:

    fn flood_fill(image: &mut Vec<Vec<i32>>, sr: usize, sc: usize, color: i32)

Starting at cell (sr, sc), repaint the 4-directionally connected region that shares the original color to the new color. Modify the grid in place. If the starting cell already has the new color, do nothing.
Example: image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2 -> [[2,2,2],[2,2,0],[2,0,1]]`,
    hints: [
      'Record old_color = image[sr][sc]; return early if old_color == color.',
      'Use a DFS/BFS stack; only expand to neighbors with old_color.',
    ],
    solution: `fn flood_fill(image: &mut Vec<Vec<i32>>, sr: usize, sc: usize, color: i32) {
    let rows = image.len();
    if rows == 0 { return; }
    let cols = image[0].len();
    let old_color = image[sr][sc];
    if old_color == color { return; }
    let mut stack = vec![(sr, sc)];
    image[sr][sc] = color;
    while let Some((y, x)) = stack.pop() {
        let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
        for (ny, nx) in cands {
            if ny < rows && nx < cols && image[ny][nx] == old_color {
                image[ny][nx] = color;
                stack.push((ny, nx));
            }
        }
    }
}

fn main() {
    let mut img = vec![vec![1i32,1,1], vec![1,1,0], vec![1,0,1]];
    flood_fill(&mut img, 1, 1, 2);
    assert_eq!(img[0], vec![2,2,2]);
    assert_eq!(img[1], vec![2,2,0]);
    assert_eq!(img[2], vec![2,0,1]);
    let mut img2 = vec![vec![0i32,0,0]];
    flood_fill(&mut img2, 0, 0, 0);
    assert_eq!(img2[0], vec![0,0,0]);
    println!("ok");
}`,
    starter: `fn flood_fill(image: &mut Vec<Vec<i32>>, sr: usize, sc: usize, color: i32) {
    // TODO
    todo!()
}

fn main() {
    let mut img = vec![vec![1i32]];
    flood_fill(&mut img, 0, 0, 2);
    assert_eq!(img[0][0], 2);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'grid'],
  },
  {
    id: 'ds-ch11-c-006',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Max Area of Island',
    prompt: `Implement:

    fn max_area_island(grid: &[Vec<i32>]) -> i32

Each cell is 1 (land) or 0 (water). Return the area of the largest island, where area is the number of land cells in a 4-connected component. Return 0 if no land exists or the grid is empty.
Example: [[0,0,1,0],[0,0,1,0],[0,1,1,0]] -> 4`,
    hints: [
      'For each unvisited land cell, run a DFS/BFS and count how many cells you visit.',
      'Track the maximum area seen across all components.',
    ],
    solution: `fn max_area_island(grid: &[Vec<i32>]) -> i32 {
    let rows = grid.len();
    if rows == 0 { return 0; }
    let cols = grid[0].len();
    let mut seen = vec![vec![false; cols]; rows];
    let mut best = 0;
    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == 1 && !seen[r][c] {
                let mut area = 0;
                let mut stack = vec![(r, c)];
                seen[r][c] = true;
                while let Some((y, x)) = stack.pop() {
                    area += 1;
                    let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
                    for (ny, nx) in cands {
                        if ny < rows && nx < cols && grid[ny][nx] == 1 && !seen[ny][nx] {
                            seen[ny][nx] = true;
                            stack.push((ny, nx));
                        }
                    }
                }
                best = best.max(area);
            }
        }
    }
    best
}

fn main() {
    let g = vec![
        vec![0i32, 0, 1, 0],
        vec![0, 0, 1, 0],
        vec![0, 1, 1, 0],
    ];
    assert_eq!(max_area_island(&g), 4);
    assert_eq!(max_area_island(&[]), 0);
    let g2 = vec![vec![0i32,0], vec![0,0]];
    assert_eq!(max_area_island(&g2), 0);
    let g3 = vec![vec![1i32,1], vec![1,1]];
    assert_eq!(max_area_island(&g3), 4);
    let g4 = vec![vec![1i32,0], vec![0,1]];
    assert_eq!(max_area_island(&g4), 1);
    println!("ok");
}`,
    starter: `fn max_area_island(grid: &[Vec<i32>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_area_island(&[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'grid'],
  },
  {
    id: 'ds-ch11-c-007',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Island Perimeter',
    prompt: `Implement:

    fn island_perimeter(grid: &[Vec<i32>]) -> i32

Each cell is 1 (land) or 0 (water). The grid contains exactly one island (no lakes inside). Return the perimeter of that island. Each land cell contributes one side for each neighboring cell that is water or out of bounds.
Example: [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]] -> 16`,
    hints: [
      'For every land cell, count how many of its 4 neighbors are water or outside the grid.',
      'Sum those counts across all land cells.',
    ],
    solution: `fn island_perimeter(grid: &[Vec<i32>]) -> i32 {
    let rows = grid.len();
    if rows == 0 { return 0; }
    let cols = grid[0].len();
    let mut perim = 0;
    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == 1 {
                let cands = [(r.wrapping_sub(1), c), (r+1, c), (r, c.wrapping_sub(1)), (r, c+1)];
                for (nr, nc) in cands {
                    if nr >= rows || nc >= cols || grid[nr][nc] == 0 {
                        perim += 1;
                    }
                }
            }
        }
    }
    perim
}

fn main() {
    let g = vec![vec![0i32,1,0,0], vec![1,1,1,0], vec![0,1,0,0], vec![1,1,0,0]];
    assert_eq!(island_perimeter(&g), 16);
    let g2 = vec![vec![1i32]];
    assert_eq!(island_perimeter(&g2), 4);
    assert_eq!(island_perimeter(&[]), 0);
    let g3 = vec![vec![1i32,1], vec![1,1]];
    assert_eq!(island_perimeter(&g3), 8);
    println!("ok");
}`,
    starter: `fn island_perimeter(grid: &[Vec<i32>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(island_perimeter(&[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'grid', 'geometry'],
  },
  {
    id: 'ds-ch11-c-008',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Clone Graph Adjacency List',
    prompt: `Implement:

    fn clone_graph_adj(n: usize, adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>>

Given a graph of n nodes (0-indexed) as an adjacency list, return a deep copy where each neighbor list is sorted in ascending order. Return an empty Vec when n == 0.
Example: n=3, adj=[[1,2],[0,2],[0,1]] -> [[1,2],[0,2],[0,1]] (a new allocation, same structure)`,
    hints: [
      'Allocate a new Vec<Vec<usize>> of length n.',
      'Clone each neighbor list and sort it before storing.',
    ],
    solution: `fn clone_graph_adj(n: usize, adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    if n == 0 { return vec![]; }
    let mut result = vec![vec![]; n];
    for i in 0..n {
        let mut neighbors = adj[i].clone();
        neighbors.sort();
        result[i] = neighbors;
    }
    result
}

fn main() {
    let adj = vec![vec![1usize,2], vec![0,2], vec![0,1]];
    let cloned = clone_graph_adj(3, &adj);
    assert_eq!(cloned[0], vec![1,2]);
    assert_eq!(cloned[1], vec![0,2]);
    assert_eq!(cloned[2], vec![0,1]);
    assert_eq!(clone_graph_adj(0, &vec![]), vec![] as Vec<Vec<usize>>);
    assert_ne!(&cloned as *const _, &adj as *const _);
    println!("ok");
}`,
    starter: `fn clone_graph_adj(n: usize, adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(clone_graph_adj(0, &vec![]), vec![] as Vec<Vec<usize>>);
    println!("ok");
}`,
    tags: ['graph', 'clone', 'adjacency-list'],
  },
  {
    id: 'ds-ch11-c-009',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Path Exists in Directed Graph',
    prompt: `Implement:

    fn has_path(n: usize, adj: &Vec<Vec<usize>>, src: usize, dst: usize) -> bool

Given a directed graph of n nodes as an adjacency list, return true if there is a directed path from src to dst. Return false when n == 0.
Example: n=4, adj=[[1,2],[3],[],[]], src=0, dst=3 -> true; src=2, dst=3 -> false`,
    hints: [
      'Iterative DFS from src; if you reach dst, return true.',
      'Only follow directed edges (adj[node] contains outgoing neighbors).',
    ],
    solution: `fn has_path(n: usize, adj: &Vec<Vec<usize>>, src: usize, dst: usize) -> bool {
    if n == 0 { return false; }
    if src == dst { return true; }
    let mut visited = vec![false; n];
    let mut stack = vec![src];
    visited[src] = true;
    while let Some(node) = stack.pop() {
        if node == dst { return true; }
        for &nb in &adj[node] {
            if !visited[nb] {
                visited[nb] = true;
                stack.push(nb);
            }
        }
    }
    false
}

fn main() {
    let adj = vec![
        vec![1usize, 2],
        vec![3],
        vec![],
        vec![],
    ];
    assert!(has_path(4, &adj, 0, 3));
    assert!(!has_path(4, &adj, 2, 3));
    assert!(!has_path(4, &adj, 2, 1));
    assert!(has_path(4, &adj, 0, 0));
    assert!(!has_path(0, &vec![], 0, 0));
    println!("ok");
}`,
    starter: `fn has_path(n: usize, adj: &Vec<Vec<usize>>, src: usize, dst: usize) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(!has_path(0, &vec![], 0, 0));
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'reachability'],
  },
  {
    id: 'ds-ch11-c-010',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'All Reachable Nodes from Source',
    prompt: `Implement:

    fn reachable_nodes(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize>

Given an undirected graph of n nodes as an adjacency list, return all nodes reachable from start (including start itself), sorted in ascending order. Return an empty Vec when n == 0.
Example: n=5, adj=[[1,2],[0,2],[0,1],[4],[3]], start=0 -> [0,1,2]`,
    hints: [
      'DFS or BFS from start, collecting all visited nodes.',
      'Sort the result before returning.',
    ],
    solution: `fn reachable_nodes(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    if n == 0 { return vec![]; }
    let mut visited = vec![false; n];
    let mut result = Vec::new();
    let mut stack = vec![start];
    visited[start] = true;
    while let Some(node) = stack.pop() {
        result.push(node);
        for &nb in &adj[node] {
            if !visited[nb] {
                visited[nb] = true;
                stack.push(nb);
            }
        }
    }
    result.sort();
    result
}

fn main() {
    let adj = vec![vec![1usize,2], vec![0,2], vec![0,1], vec![4], vec![3]];
    let r = reachable_nodes(5, &adj, 0);
    assert_eq!(r, vec![0,1,2]);
    let r2 = reachable_nodes(5, &adj, 3);
    assert_eq!(r2, vec![3,4]);
    assert_eq!(reachable_nodes(0, &vec![], 0), vec![]);
    println!("ok");
}`,
    starter: `fn reachable_nodes(n: usize, adj: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(reachable_nodes(0, &vec![], 0), vec![]);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'reachability'],
  },
  {
    id: 'ds-ch11-c-011',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Course Schedule: Can Finish',
    prompt: `Implement:

    fn can_finish(num_courses: usize, prerequisites: &[(usize, usize)]) -> bool

There are num_courses courses labeled 0..num_courses-1. prerequisites[i] = (a, b) means you must take b before a. Return true if all courses can be finished (i.e., there is no cycle in the dependency graph).
Example: can_finish(2, &[(1,0)]) -> true; can_finish(2, &[(1,0),(0,1)]) -> false`,
    hints: [
      'Build a directed graph and look for a cycle using DFS with a three-color state: unvisited, in-stack, done.',
      'If you revisit an in-stack node, a cycle exists.',
    ],
    solution: `fn can_finish(num_courses: usize, prerequisites: &[(usize, usize)]) -> bool {
    let mut adj = vec![vec![]; num_courses];
    for &(a, b) in prerequisites {
        adj[b].push(a);
    }
    let mut state = vec![0u8; num_courses];
    fn dfs(node: usize, adj: &Vec<Vec<usize>>, state: &mut Vec<u8>) -> bool {
        if state[node] == 1 { return false; }
        if state[node] == 2 { return true; }
        state[node] = 1;
        for &nb in &adj[node] {
            if !dfs(nb, adj, state) { return false; }
        }
        state[node] = 2;
        true
    }
    for i in 0..num_courses {
        if !dfs(i, &adj, &mut state) { return false; }
    }
    true
}

fn main() {
    assert!(can_finish(2, &[(1,0)]));
    assert!(!can_finish(2, &[(1,0),(0,1)]));
    assert!(can_finish(4, &[(1,0),(2,1),(3,2)]));
    assert!(!can_finish(3, &[(0,1),(1,2),(2,0)]));
    assert!(can_finish(1, &[]));
    println!("ok");
}`,
    starter: `fn can_finish(num_courses: usize, prerequisites: &[(usize, usize)]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(can_finish(1, &[]));
    println!("ok");
}`,
    tags: ['graph', 'cycle-detection', 'dfs', 'topological-sort'],
  },
  {
    id: 'ds-ch11-c-012',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Course Schedule: Topological Order via Kahns',
    prompt: `Implement:

    fn course_order(num_courses: usize, prerequisites: &[(usize, usize)]) -> Vec<usize>

Same input as the previous problem. Return one valid ordering of all courses using Kahns algorithm (BFS-based topological sort). If a cycle makes this impossible, return an empty Vec.
Example: course_order(4, &[(1,0),(2,0),(3,1),(3,2)]) -> a valid order where 0 comes first and 3 comes last.`,
    hints: [
      'Compute in-degrees; enqueue all nodes with in-degree 0.',
      'Pop from the queue, output the node, decrement neighbors in-degree, enqueue those hitting 0.',
    ],
    solution: `use std::collections::VecDeque;

fn course_order(num_courses: usize, prerequisites: &[(usize, usize)]) -> Vec<usize> {
    let mut adj = vec![vec![]; num_courses];
    let mut indegree = vec![0usize; num_courses];
    for &(a, b) in prerequisites {
        adj[b].push(a);
        indegree[a] += 1;
    }
    let mut q = VecDeque::new();
    for i in 0..num_courses {
        if indegree[i] == 0 { q.push_back(i); }
    }
    let mut order = Vec::new();
    while let Some(node) = q.pop_front() {
        order.push(node);
        for &nb in &adj[node] {
            indegree[nb] -= 1;
            if indegree[nb] == 0 { q.push_back(nb); }
        }
    }
    if order.len() == num_courses { order } else { vec![] }
}

fn main() {
    let o = course_order(4, &[(1,0),(2,0),(3,1),(3,2)]);
    assert_eq!(o.len(), 4);
    let pos: Vec<usize> = {
        let mut p = vec![0usize; 4];
        for (i, &c) in o.iter().enumerate() { p[c] = i; }
        p
    };
    assert!(pos[0] < pos[1]);
    assert!(pos[0] < pos[2]);
    assert!(pos[1] < pos[3]);
    assert!(pos[2] < pos[3]);
    assert_eq!(course_order(2, &[(1,0),(0,1)]), vec![]);
    assert_eq!(course_order(1, &[]).len(), 1);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn course_order(num_courses: usize, prerequisites: &[(usize, usize)]) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(course_order(1, &[]).len(), 1);
    println!("ok");
}`,
    tags: ['graph', 'topological-sort', 'bfs', 'kahns'],
  },
  {
    id: 'ds-ch11-c-013',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rotting Oranges: Multi-Source BFS',
    prompt: `Implement:

    fn oranges_rotting(grid: &[Vec<i32>]) -> i32

Cells are 0 (empty), 1 (fresh orange), or 2 (rotten orange). Each minute, every rotten orange spreads to 4-adjacent fresh oranges. Return the minimum minutes until no fresh oranges remain, or -1 if that is impossible. Return 0 for an empty grid.
Example: [[2,1,1],[1,1,0],[0,1,1]] -> 4`,
    hints: [
      'Enqueue all initially rotten cells at time 0 for multi-source BFS.',
      'Count fresh oranges upfront; decrement as they rot; return -1 if any remain after BFS.',
    ],
    solution: `use std::collections::VecDeque;

fn oranges_rotting(grid: &[Vec<i32>]) -> i32 {
    let rows = grid.len();
    if rows == 0 { return 0; }
    let cols = grid[0].len();
    let mut g: Vec<Vec<i32>> = grid.iter().map(|r| r.clone()).collect();
    let mut q = VecDeque::new();
    let mut fresh = 0;
    for r in 0..rows {
        for c in 0..cols {
            if g[r][c] == 2 { q.push_back((r, c, 0i32)); }
            else if g[r][c] == 1 { fresh += 1; }
        }
    }
    let mut minutes = 0;
    while let Some((y, x, t)) = q.pop_front() {
        minutes = minutes.max(t);
        let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
        for (ny, nx) in cands {
            if ny < rows && nx < cols && g[ny][nx] == 1 {
                g[ny][nx] = 2;
                fresh -= 1;
                q.push_back((ny, nx, t+1));
            }
        }
    }
    if fresh > 0 { -1 } else { minutes }
}

fn main() {
    let g = vec![vec![2i32,1,1], vec![1,1,0], vec![0,1,1]];
    assert_eq!(oranges_rotting(&g), 4);
    let g2 = vec![vec![2i32,1,1], vec![0,1,1], vec![1,0,1]];
    assert_eq!(oranges_rotting(&g2), -1);
    let g3 = vec![vec![0i32,2]];
    assert_eq!(oranges_rotting(&g3), 0);
    assert_eq!(oranges_rotting(&[]), 0);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn oranges_rotting(grid: &[Vec<i32>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(oranges_rotting(&[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'multi-source', 'grid'],
  },
  {
    id: 'ds-ch11-c-014',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Walls and Gates: Distance Fill',
    prompt: `Implement:

    fn walls_and_gates(rooms: &mut Vec<Vec<i32>>)

The grid contains -1 (wall), 0 (gate), or i32::MAX (empty room). Fill each empty room with the distance to its nearest gate using BFS. Rooms unreachable from any gate remain i32::MAX.
Example: a 4x4 grid with gates at (0,2) and (3,0) produces rooms[0][0]=3, rooms[0][3]=1.`,
    hints: [
      'Start multi-source BFS from all gates simultaneously.',
      'Only update cells that are currently i32::MAX; this ensures the first time you reach a room is via the shortest path.',
    ],
    solution: `use std::collections::VecDeque;

fn walls_and_gates(rooms: &mut Vec<Vec<i32>>) {
    let rows = rooms.len();
    if rows == 0 { return; }
    let cols = rooms[0].len();
    let inf = i32::MAX;
    let mut q = VecDeque::new();
    for r in 0..rows {
        for c in 0..cols {
            if rooms[r][c] == 0 { q.push_back((r, c)); }
        }
    }
    while let Some((y, x)) = q.pop_front() {
        let dist = rooms[y][x];
        let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
        for (ny, nx) in cands {
            if ny < rows && nx < cols && rooms[ny][nx] == inf {
                rooms[ny][nx] = dist + 1;
                q.push_back((ny, nx));
            }
        }
    }
}

fn main() {
    let inf = i32::MAX;
    let mut rooms = vec![
        vec![inf, -1, 0, inf],
        vec![inf, inf, inf, -1],
        vec![inf, -1, inf, -1],
        vec![0, -1, inf, inf],
    ];
    walls_and_gates(&mut rooms);
    assert_eq!(rooms[0][0], 3);
    assert_eq!(rooms[0][3], 1);
    assert_eq!(rooms[1][2], 1);
    assert_eq!(rooms[3][2], 3);
    assert_eq!(rooms[3][3], 4);
    walls_and_gates(&mut vec![]);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn walls_and_gates(rooms: &mut Vec<Vec<i32>>) {
    // TODO
    todo!()
}

fn main() {
    walls_and_gates(&mut vec![]);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'multi-source', 'grid'],
  },
  {
    id: 'ds-ch11-c-015',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Surrounded Regions: Capture O Islands',
    prompt: `Implement:

    fn capture_regions(board: &mut Vec<Vec<char>>)

Modify the board in place: flip every 'O' that is fully surrounded (not connected to any border 'O') to 'X'. Border-connected 'O' regions are preserved.
Example: board with inner 'O's fully enclosed by 'X's -> those inner 'O's become 'X'.`,
    hints: [
      'Mark all border-connected O cells as safe using DFS/BFS from every border O.',
      'Then flip all O cells that are not marked safe to X.',
    ],
    solution: `fn capture_regions(board: &mut Vec<Vec<char>>) {
    let rows = board.len();
    if rows == 0 { return; }
    let cols = board[0].len();
    let mut safe = vec![vec![false; cols]; rows];
    let mut stack: Vec<(usize, usize)> = Vec::new();
    for r in 0..rows {
        for c in 0..cols {
            if (r == 0 || r == rows-1 || c == 0 || c == cols-1) && board[r][c] == 'O' {
                stack.push((r, c));
                safe[r][c] = true;
            }
        }
    }
    while let Some((y, x)) = stack.pop() {
        let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
        for (ny, nx) in cands {
            if ny < rows && nx < cols && board[ny][nx] == 'O' && !safe[ny][nx] {
                safe[ny][nx] = true;
                stack.push((ny, nx));
            }
        }
    }
    for r in 0..rows {
        for c in 0..cols {
            if board[r][c] == 'O' && !safe[r][c] {
                board[r][c] = 'X';
            }
        }
    }
}

fn main() {
    let mut b = vec![
        vec!['X','X','X','X'],
        vec!['X','O','O','X'],
        vec!['X','X','O','X'],
        vec!['X','O','X','X'],
    ];
    capture_regions(&mut b);
    assert_eq!(b[1][1], 'X');
    assert_eq!(b[1][2], 'X');
    assert_eq!(b[2][2], 'X');
    assert_eq!(b[3][1], 'O');
    capture_regions(&mut vec![]);
    println!("ok");
}`,
    starter: `fn capture_regions(board: &mut Vec<Vec<char>>) {
    // TODO
    todo!()
}

fn main() {
    capture_regions(&mut vec![]);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'grid', 'border-bfs'],
  },
  {
    id: 'ds-ch11-c-016',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pacific Atlantic Water Flow',
    prompt: `Implement:

    fn pacific_atlantic(heights: &[Vec<i32>]) -> Vec<(usize, usize)>

Water flows from a cell to a neighbor if the neighbor height is less than or equal to the current height. The Pacific Ocean borders the top and left edges; the Atlantic Ocean borders the bottom and right edges. Return all cells from which water can flow to both oceans.
Example: a 5x5 heights grid -> returns 7 specific cells.`,
    hints: [
      'Reverse the flow: BFS from all Pacific-border cells and separately from all Atlantic-border cells.',
      'A cell belongs to the answer if it is reachable in both BFS passes.',
    ],
    solution: `use std::collections::VecDeque;

fn pacific_atlantic(heights: &[Vec<i32>]) -> Vec<(usize, usize)> {
    let rows = heights.len();
    if rows == 0 { return vec![]; }
    let cols = heights[0].len();
    let mut pac = vec![vec![false; cols]; rows];
    let mut atl = vec![vec![false; cols]; rows];
    let mut pq = VecDeque::new();
    let mut aq = VecDeque::new();
    for r in 0..rows {
        pac[r][0] = true; pq.push_back((r, 0));
        atl[r][cols-1] = true; aq.push_back((r, cols-1));
    }
    for c in 0..cols {
        pac[0][c] = true; pq.push_back((0, c));
        atl[rows-1][c] = true; aq.push_back((rows-1, c));
    }
    let bfs = |q: &mut VecDeque<(usize,usize)>, reach: &mut Vec<Vec<bool>>| {
        while let Some((y, x)) = q.pop_front() {
            let cands = [(y.wrapping_sub(1), x), (y+1, x), (y, x.wrapping_sub(1)), (y, x+1)];
            for (ny, nx) in cands {
                if ny < rows && nx < cols && !reach[ny][nx] && heights[ny][nx] >= heights[y][x] {
                    reach[ny][nx] = true;
                    q.push_back((ny, nx));
                }
            }
        }
    };
    bfs(&mut pq, &mut pac);
    bfs(&mut aq, &mut atl);
    let mut res = vec![];
    for r in 0..rows {
        for c in 0..cols {
            if pac[r][c] && atl[r][c] { res.push((r, c)); }
        }
    }
    res
}

fn main() {
    let h = vec![
        vec![1i32,2,2,3,5],
        vec![3,2,3,4,4],
        vec![2,4,5,3,1],
        vec![6,7,1,4,5],
        vec![5,1,1,2,4],
    ];
    let res = pacific_atlantic(&h);
    assert!(res.contains(&(0,4)));
    assert!(res.contains(&(1,3)));
    assert!(res.contains(&(1,4)));
    assert!(res.contains(&(2,2)));
    assert!(res.contains(&(3,0)));
    assert!(res.contains(&(3,1)));
    assert!(res.contains(&(4,0)));
    assert_eq!(pacific_atlantic(&[]), vec![]);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn pacific_atlantic(heights: &[Vec<i32>]) -> Vec<(usize, usize)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(pacific_atlantic(&[]), vec![]);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'grid', 'multi-source'],
  },
  {
    id: 'ds-ch11-c-017',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Number of Provinces via Union-Find',
    prompt: `Implement:

    fn num_provinces(is_connected: &[Vec<i32>]) -> i32

Given an n x n adjacency matrix where is_connected[i][j] == 1 means cities i and j are directly connected, return the number of provinces (connected components) using Union-Find with path compression.
Example: [[1,1,0],[1,1,0],[0,0,1]] -> 2`,
    hints: [
      'Initialize parent[i] = i for all i.',
      'For each pair (i,j) with is_connected[i][j]==1, union them; then count distinct roots.',
    ],
    solution: `fn num_provinces(is_connected: &[Vec<i32>]) -> i32 {
    let n = is_connected.len();
    if n == 0 { return 0; }
    let mut parent: Vec<usize> = (0..n).collect();
    fn find(p: &mut Vec<usize>, x: usize) -> usize {
        if p[x] != x { p[x] = find(p, p[x]); }
        p[x]
    }
    fn union(p: &mut Vec<usize>, a: usize, b: usize) {
        let ra = find(p, a);
        let rb = find(p, b);
        if ra != rb { p[ra] = rb; }
    }
    for i in 0..n {
        for j in 0..n {
            if is_connected[i][j] == 1 { union(&mut parent, i, j); }
        }
    }
    let mut roots = std::collections::HashSet::new();
    for i in 0..n { roots.insert(find(&mut parent, i)); }
    roots.len() as i32
}

fn main() {
    let m = vec![vec![1i32,1,0], vec![1,1,0], vec![0,0,1]];
    assert_eq!(num_provinces(&m), 2);
    let m2 = vec![vec![1i32,0,0], vec![0,1,0], vec![0,0,1]];
    assert_eq!(num_provinces(&m2), 3);
    let m3 = vec![vec![1i32,1,1], vec![1,1,1], vec![1,1,1]];
    assert_eq!(num_provinces(&m3), 1);
    assert_eq!(num_provinces(&[]), 0);
    println!("ok");
}`,
    starter: `fn num_provinces(is_connected: &[Vec<i32>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(num_provinces(&[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'union-find', 'connected-components'],
  },
  {
    id: 'ds-ch11-c-018',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Redundant Connection via Union-Find',
    prompt: `Implement:

    fn find_redundant_connection(edges: &[(usize, usize)]) -> (usize, usize)

Given edges of an undirected graph that started as a tree and had one extra edge added, return that extra (redundant) edge. Nodes are 1-indexed. If multiple valid answers exist, return the one that appears last in the input.
Example: edges=[(1,2),(1,3),(2,3)] -> (2,3)`,
    hints: [
      'Process edges one by one with Union-Find.',
      'When you encounter an edge whose two endpoints already share the same root, that edge is the redundant one.',
    ],
    solution: `fn find_redundant_connection(edges: &[(usize, usize)]) -> (usize, usize) {
    let n = edges.len();
    let mut parent: Vec<usize> = (0..=n).collect();
    fn find(p: &mut Vec<usize>, x: usize) -> usize {
        if p[x] != x { p[x] = find(p, p[x]); }
        p[x]
    }
    for &(u, v) in edges {
        let ru = find(&mut parent, u);
        let rv = find(&mut parent, v);
        if ru == rv { return (u, v); }
        parent[ru] = rv;
    }
    (0, 0)
}

fn main() {
    assert_eq!(find_redundant_connection(&[(1,2),(1,3),(2,3)]), (2,3));
    assert_eq!(find_redundant_connection(&[(1,2),(2,3),(3,4),(1,4),(1,5)]), (1,4));
    assert_eq!(find_redundant_connection(&[(1,2),(1,3),(1,4),(3,4)]), (3,4));
    println!("ok");
}`,
    starter: `fn find_redundant_connection(edges: &[(usize, usize)]) -> (usize, usize) {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_redundant_connection(&[(1,2),(1,3),(2,3)]), (2,3));
    println!("ok");
}`,
    tags: ['graph', 'union-find', 'cycle-detection'],
  },
  {
    id: 'ds-ch11-c-019',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Shortest Path in Unweighted Graph',
    prompt: `Implement:

    fn shortest_path_unweighted(n: usize, adj: &Vec<Vec<usize>>, src: usize, dst: usize) -> i32

Given an undirected unweighted graph as an adjacency list, return the shortest path length (number of edges) from src to dst. Return 0 if src == dst. Return -1 if dst is unreachable or n == 0.
Example: n=5, adj=[[1,2],[0,3],[0,3],[1,2,4],[3]], src=0, dst=4 -> 3`,
    hints: [
      'Use BFS from src; the first time dst is dequeued its distance is the shortest.',
      'Initialize dist array to i32::MAX; update when a node is first enqueued.',
    ],
    solution: `use std::collections::VecDeque;

fn shortest_path_unweighted(n: usize, adj: &Vec<Vec<usize>>, src: usize, dst: usize) -> i32 {
    if n == 0 { return -1; }
    if src == dst { return 0; }
    let mut dist = vec![i32::MAX; n];
    dist[src] = 0;
    let mut q = VecDeque::new();
    q.push_back(src);
    while let Some(node) = q.pop_front() {
        for &nb in &adj[node] {
            if dist[nb] == i32::MAX {
                dist[nb] = dist[node] + 1;
                if nb == dst { return dist[nb]; }
                q.push_back(nb);
            }
        }
    }
    -1
}

fn main() {
    let adj = vec![vec![1usize,2], vec![0,3], vec![0,3], vec![1,2,4], vec![3]];
    assert_eq!(shortest_path_unweighted(5, &adj, 0, 4), 3);
    assert_eq!(shortest_path_unweighted(5, &adj, 0, 0), 0);
    assert_eq!(shortest_path_unweighted(5, &adj, 0, 3), 2);
    let adj2 = vec![vec![1usize], vec![0], vec![3usize], vec![2usize]];
    assert_eq!(shortest_path_unweighted(4, &adj2, 0, 3), -1);
    assert_eq!(shortest_path_unweighted(0, &vec![], 0, 0), -1);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn shortest_path_unweighted(n: usize, adj: &Vec<Vec<usize>>, src: usize, dst: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(shortest_path_unweighted(0, &vec![], 0, 0), -1);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'shortest-path'],
  },
  {
    id: 'ds-ch11-c-020',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Accounts Merge via Union-Find',
    prompt: `Implement:

    fn accounts_merge(accounts: &[Vec<String>]) -> Vec<Vec<String>>

Each account is a Vec where index 0 is the account owner name and the remaining entries are email addresses. Merge accounts that share at least one email. Return a list of merged accounts sorted by name then by email, each starting with the owner name.
Example: two John accounts sharing b@b.com get merged into one entry with all three emails sorted.`,
    hints: [
      'Assign each unique email an integer ID; use Union-Find to union IDs within the same account.',
      'Group emails by their root ID, sort them, prepend the owner name, and collect.',
    ],
    solution: `fn accounts_merge(accounts: &[Vec<String>]) -> Vec<Vec<String>> {
    let mut email_to_id: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    let mut parent: Vec<usize> = Vec::new();
    let mut id_to_name: std::collections::HashMap<usize, String> = std::collections::HashMap::new();

    fn find(p: &mut Vec<usize>, x: usize) -> usize {
        if p[x] != x { p[x] = find(p, p[x]); }
        p[x]
    }

    let mut next_id = 0usize;
    for account in accounts {
        let name = &account[0];
        let mut first_id = usize::MAX;
        for email in &account[1..] {
            if !email_to_id.contains_key(email) {
                email_to_id.insert(email.clone(), next_id);
                parent.push(next_id);
                id_to_name.insert(next_id, name.clone());
                next_id += 1;
            }
            let eid = *email_to_id.get(email).unwrap();
            if first_id == usize::MAX { first_id = eid; }
            let ra = find(&mut parent, first_id);
            let rb = find(&mut parent, eid);
            if ra != rb { parent[ra] = rb; first_id = rb; }
        }
    }

    let mut groups: std::collections::HashMap<usize, Vec<String>> = std::collections::HashMap::new();
    for (email, &id) in &email_to_id {
        let root = find(&mut parent, id);
        groups.entry(root).or_default().push(email.clone());
    }
    let mut result = Vec::new();
    for (root, mut emails) in groups {
        emails.sort();
        let mut row = vec![id_to_name[&root].clone()];
        row.extend(emails);
        result.push(row);
    }
    result.sort();
    result
}

fn main() {
    let accounts = vec![
        vec!["John".to_string(),"a@a.com".to_string(),"b@b.com".to_string()],
        vec!["John".to_string(),"b@b.com".to_string(),"c@c.com".to_string()],
        vec!["Mary".to_string(),"d@d.com".to_string()],
    ];
    let res = accounts_merge(&accounts);
    assert_eq!(res.len(), 2);
    let john = res.iter().find(|r| r[0] == "John").unwrap();
    assert_eq!(john.len(), 4);
    assert!(john.contains(&"a@a.com".to_string()));
    let mary = res.iter().find(|r| r[0] == "Mary").unwrap();
    assert_eq!(mary.len(), 2);
    println!("ok");
}`,
    starter: `fn accounts_merge(accounts: &[Vec<String>]) -> Vec<Vec<String>> {
    // TODO
    todo!()
}

fn main() {
    let accounts: Vec<Vec<String>> = vec![];
    let _ = accounts_merge(&accounts);
    println!("ok");
}`,
    tags: ['graph', 'union-find', 'hash-map', 'merge'],
  },
  {
    id: 'ds-ch11-c-021',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Word Ladder: Shortest Transformation Length',
    prompt: `Implement:

    fn word_ladder(begin_word: &str, end_word: &str, word_list: &[&str]) -> i32

Given a begin_word, an end_word, and a word_list, find the length of the shortest sequence from begin_word to end_word where each step changes exactly one character and the resulting word is in word_list. Return 0 if no such sequence exists.
Example: begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"] -> 5`,
    hints: [
      'BFS where each state is a word; generate all single-character mutations and check membership in a HashSet.',
      'The length starts at 1 (for begin_word itself); add 1 at each BFS level.',
    ],
    solution: `use std::collections::VecDeque;

fn word_ladder(begin_word: &str, end_word: &str, word_list: &[&str]) -> i32 {
    let word_set: std::collections::HashSet<&str> = word_list.iter().cloned().collect();
    if !word_set.contains(end_word) { return 0; }
    let mut visited: std::collections::HashSet<String> = std::collections::HashSet::new();
    let mut q = VecDeque::new();
    q.push_back((begin_word.to_string(), 1i32));
    visited.insert(begin_word.to_string());
    while let Some((word, steps)) = q.pop_front() {
        let chars: Vec<char> = word.chars().collect();
        for i in 0..chars.len() {
            for c in b'a'..=b'z' {
                let mut next = chars.clone();
                next[i] = c as char;
                let ns: String = next.iter().collect();
                if ns == end_word { return steps + 1; }
                if word_set.contains(ns.as_str()) && !visited.contains(&ns) {
                    visited.insert(ns.clone());
                    q.push_back((ns, steps + 1));
                }
            }
        }
    }
    0
}

fn main() {
    assert_eq!(word_ladder("hit", "cog", &["hot","dot","dog","lot","log","cog"]), 5);
    assert_eq!(word_ladder("hit", "cog", &["hot","dot","dog","lot","log"]), 0);
    assert_eq!(word_ladder("a", "c", &["a","b","c"]), 2);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn word_ladder(begin_word: &str, end_word: &str, word_list: &[&str]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(word_ladder("hit", "cog", &[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'word-ladder', 'shortest-path'],
  },
  {
    id: 'ds-ch11-c-022',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Network Delay Time: Dijkstra',
    prompt: `Implement:

    fn network_delay(n: usize, times: &[(usize, usize, i64)], k: usize) -> i64

There are n nodes (1-indexed). times[i] = (u, v, w) is a directed edge with travel time w. Starting from node k, return the time until all nodes receive the signal. Return -1 if not all nodes are reachable.
Example: n=4, times=[(2,1,1),(2,3,1),(3,4,1)], k=2 -> 2`,
    hints: [
      'Use Dijkstra with a min-heap (BinaryHeap<Reverse<...>>); relax edges greedily.',
      'The answer is max of all shortest distances; return -1 if any remain i64::MAX.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn network_delay(n: usize, times: &[(usize, usize, i64)], k: usize) -> i64 {
    let mut adj = vec![vec![]; n + 1];
    for &(u, v, w) in times {
        adj[u].push((v, w));
    }
    let mut dist = vec![i64::MAX; n + 1];
    dist[k] = 0;
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((0i64, k)));
    while let Some(Reverse((d, u))) = heap.pop() {
        if d > dist[u] { continue; }
        for &(v, w) in &adj[u] {
            let nd = d + w;
            if nd < dist[v] {
                dist[v] = nd;
                heap.push(Reverse((nd, v)));
            }
        }
    }
    let ans = dist[1..=n].iter().copied().max().unwrap_or(i64::MAX);
    if ans == i64::MAX { -1 } else { ans }
}

fn main() {
    let times = vec![(2usize, 1usize, 1i64), (2, 3, 1), (3, 4, 1)];
    assert_eq!(network_delay(4, &times, 2), 2);
    let times2 = vec![(1usize, 2usize, 1i64)];
    assert_eq!(network_delay(2, &times2, 2), -1);
    let times3 = vec![(1usize, 2usize, 1i64), (2, 3, 1), (1, 3, 4i64)];
    assert_eq!(network_delay(3, &times3, 1), 2);
    assert_eq!(network_delay(1, &[], 1), 0);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn network_delay(n: usize, times: &[(usize, usize, i64)], k: usize) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(network_delay(1, &[], 1), 0);
    println!("ok");
}`,
    tags: ['graph', 'dijkstra', 'shortest-path', 'heap'],
  },
  {
    id: 'ds-ch11-c-023',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Is Graph Bipartite: BFS Coloring',
    prompt: `Implement:

    fn is_bipartite(n: usize, adj: &Vec<Vec<usize>>) -> bool

Given an undirected graph of n nodes as an adjacency list, return true if the graph is bipartite (its nodes can be two-colored so no edge connects nodes of the same color). Handle disconnected graphs.
Example: 4-cycle [[1,3],[0,2],[1,3],[0,2]] -> true; triangle [[1,2],[0,2],[0,1]] -> false`,
    hints: [
      'BFS from every unvisited node; assign alternating colors 0/1.',
      'If a neighbor already has the same color as the current node, return false.',
    ],
    solution: `fn is_bipartite(n: usize, adj: &Vec<Vec<usize>>) -> bool {
    if n == 0 { return true; }
    let mut color = vec![-1i32; n];
    use std::collections::VecDeque;
    for start in 0..n {
        if color[start] != -1 { continue; }
        color[start] = 0;
        let mut q = VecDeque::new();
        q.push_back(start);
        while let Some(node) = q.pop_front() {
            for &nb in &adj[node] {
                if color[nb] == -1 {
                    color[nb] = 1 - color[node];
                    q.push_back(nb);
                } else if color[nb] == color[node] {
                    return false;
                }
            }
        }
    }
    true
}

fn main() {
    let adj = vec![vec![1usize,3], vec![0,2], vec![1,3], vec![0,2]];
    assert!(is_bipartite(4, &adj));
    let adj2 = vec![vec![1usize,2], vec![0,2], vec![0,1]];
    assert!(!is_bipartite(3, &adj2));
    let adj3 = vec![vec![1usize], vec![0], vec![3usize], vec![2usize]];
    assert!(is_bipartite(4, &adj3));
    assert!(is_bipartite(0, &vec![]));
    println!("ok");
}`,
    starter: `fn is_bipartite(n: usize, adj: &Vec<Vec<usize>>) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_bipartite(0, &vec![]));
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'bipartite', 'coloring'],
  },
  {
    id: 'ds-ch11-c-024',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Cheapest Flights Within K Stops',
    prompt: `Implement:

    fn cheapest_flights(n: usize, flights: &[(usize, usize, i32)], src: usize, dst: usize, k: usize) -> i32

Find the cheapest price from src to dst with at most k intermediate stops (i.e., at most k+1 edges). Return -1 if no such path exists. flights[i] = (from, to, price).
Example: n=3, flights=[(0,1,100),(1,2,100),(0,2,500)], src=0, dst=2, k=1 -> 200`,
    hints: [
      'Use a modified Dijkstra where the state is (cost, node, stops_used); prune states with stops > k.',
      'Track dist[stops][node] to avoid redundant re-expansions.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn cheapest_flights(n: usize, flights: &[(usize, usize, i32)], src: usize, dst: usize, k: usize) -> i32 {
    let mut adj = vec![vec![]; n];
    for &(u, v, w) in flights {
        adj[u].push((v, w));
    }
    let mut dist = vec![vec![i32::MAX; n]; k + 2];
    dist[0][src] = 0;
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((0i32, src, 0usize)));
    while let Some(Reverse((cost, u, stops))) = heap.pop() {
        if u == dst { return cost; }
        if stops > k { continue; }
        if cost > dist[stops][u] { continue; }
        for &(v, w) in &adj[u] {
            let nc = cost + w;
            if nc < dist[stops + 1][v] {
                dist[stops + 1][v] = nc;
                heap.push(Reverse((nc, v, stops + 1)));
            }
        }
    }
    -1
}

fn main() {
    let flights = vec![(0usize,1usize,100i32),(1,2,100),(0,2,500)];
    assert_eq!(cheapest_flights(3, &flights, 0, 2, 1), 200);
    assert_eq!(cheapest_flights(3, &flights, 0, 2, 0), 500);
    let flights2 = vec![(0usize,1usize,1i32),(0,2,5),(1,2,1),(2,3,1)];
    assert_eq!(cheapest_flights(4, &flights2, 0, 3, 1), 6);
    assert_eq!(cheapest_flights(3, &vec![(0usize,1usize,1i32)], 0, 2, 1), -1);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn cheapest_flights(n: usize, flights: &[(usize, usize, i32)], src: usize, dst: usize, k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(cheapest_flights(3, &vec![], 0, 2, 1), -1);
    println!("ok");
}`,
    tags: ['graph', 'dijkstra', 'shortest-path', 'constrained'],
  },
  {
    id: 'ds-ch11-c-025',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Critical Connections: Bridge Finding',
    prompt: `Implement:

    fn critical_connections(n: usize, connections: &[(usize, usize)]) -> Vec<(usize, usize)>

Given an undirected connected graph of n servers and a list of connections, find all critical connections (bridges). A bridge is an edge whose removal increases the number of connected components. Return them in any order.
Example: n=4, connections=[(0,1),(1,2),(2,0),(1,3)] -> [(1,3)]`,
    hints: [
      'Use Tarjans bridge-finding DFS: record discovery time and low-link value for each node.',
      'Edge (u,v) is a bridge if low[v] > disc[u] after visiting v from u.',
    ],
    solution: `fn critical_connections(n: usize, connections: &[(usize, usize)]) -> Vec<(usize, usize)> {
    let mut adj = vec![vec![]; n];
    for &(u, v) in connections {
        adj[u].push(v);
        adj[v].push(u);
    }
    let mut disc = vec![usize::MAX; n];
    let mut low = vec![0usize; n];
    let mut timer = 0usize;
    let mut bridges = Vec::new();

    fn dfs(
        u: usize, parent: usize,
        adj: &Vec<Vec<usize>>,
        disc: &mut Vec<usize>,
        low: &mut Vec<usize>,
        timer: &mut usize,
        bridges: &mut Vec<(usize, usize)>,
    ) {
        disc[u] = *timer;
        low[u] = *timer;
        *timer += 1;
        for &v in &adj[u] {
            if disc[v] == usize::MAX {
                dfs(v, u, adj, disc, low, timer, bridges);
                low[u] = low[u].min(low[v]);
                if low[v] > disc[u] {
                    bridges.push((u, v));
                }
            } else if v != parent {
                low[u] = low[u].min(disc[v]);
            }
        }
    }

    for i in 0..n {
        if disc[i] == usize::MAX {
            dfs(i, usize::MAX, &adj, &mut disc, &mut low, &mut timer, &mut bridges);
        }
    }
    bridges
}

fn main() {
    let b = critical_connections(4, &[(0,1),(1,2),(2,0),(1,3)]);
    assert_eq!(b.len(), 1);
    assert!(b.contains(&(1,3)) || b.contains(&(3,1)));
    let b2 = critical_connections(2, &[(0,1)]);
    assert_eq!(b2.len(), 1);
    let b3 = critical_connections(3, &[(0,1),(1,2),(2,0)]);
    assert_eq!(b3.len(), 0);
    println!("ok");
}`,
    starter: `fn critical_connections(n: usize, connections: &[(usize, usize)]) -> Vec<(usize, usize)> {
    // TODO
    todo!()
}

fn main() {
    let _ = critical_connections(1, &[]);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'bridges', 'tarjan'],
  },
  {
    id: 'ds-ch11-c-026',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reconstruct Itinerary: Hierholzer Algorithm',
    prompt: `Implement:

    fn reconstruct_itinerary(tickets: Vec<(String, String)>) -> Vec<String>

Given airline tickets as (from, to) pairs, reconstruct the itinerary starting from "JFK". Use all tickets exactly once and return the lexicographically smallest valid itinerary. Assume a valid itinerary always exists.
Example: [("MUC","LHR"),("JFK","MUC"),("SFO","SJC"),("LHR","SFO")] -> ["JFK","MUC","LHR","SFO","SJC"]`,
    hints: [
      'Sort tickets so neighbors are in lexicographic order; build an adjacency list of VecDeques.',
      'Use Hierholzers algorithm: DFS with a stack, appending to the route when no more neighbors remain.',
    ],
    solution: `fn reconstruct_itinerary(mut tickets: Vec<(String, String)>) -> Vec<String> {
    tickets.sort();
    let mut adj: std::collections::HashMap<String, std::collections::VecDeque<String>> = std::collections::HashMap::new();
    for (from, to) in tickets {
        adj.entry(from).or_default().push_back(to);
    }
    let mut route = Vec::new();
    let mut stack = vec!["JFK".to_string()];
    while let Some(top) = stack.last().cloned() {
        if let Some(neighbors) = adj.get_mut(&top) {
            if let Some(next) = neighbors.pop_front() {
                stack.push(next);
                continue;
            }
        }
        route.push(stack.pop().unwrap());
    }
    route.reverse();
    route
}

fn main() {
    let t = vec![
        ("MUC".to_string(),"LHR".to_string()),
        ("JFK".to_string(),"MUC".to_string()),
        ("SFO".to_string(),"SJC".to_string()),
        ("LHR".to_string(),"SFO".to_string()),
    ];
    let r = reconstruct_itinerary(t);
    assert_eq!(r, vec!["JFK","MUC","LHR","SFO","SJC"]);
    let t2 = vec![
        ("JFK".to_string(),"A".to_string()),
        ("A".to_string(),"JFK".to_string()),
        ("JFK".to_string(),"B".to_string()),
    ];
    let r2 = reconstruct_itinerary(t2);
    assert_eq!(r2[0], "JFK");
    assert_eq!(r2.len(), 4);
    println!("ok");
}`,
    starter: `fn reconstruct_itinerary(tickets: Vec<(String, String)>) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let t = vec![("JFK".to_string(),"A".to_string())];
    let r = reconstruct_itinerary(t);
    assert_eq!(r[0], "JFK");
    println!("ok");
}`,
    tags: ['graph', 'eulerian-path', 'hierholzer', 'dfs'],
  },
  {
    id: 'ds-ch11-c-027',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Cost to Connect All Points: Prims MST',
    prompt: `Implement:

    fn min_cost_connect_points(points: &[(i64, i64)]) -> i64

Given a list of 2D points, connect all points with the minimum total Manhattan distance cost (minimum spanning tree). Return 0 for zero or one point.
Example: points=[(0,0),(2,2),(3,10),(5,2),(7,0)] -> 20`,
    hints: [
      'Use Prims algorithm: maintain a min-distance array and greedily add the cheapest node not yet in the MST.',
      'Manhattan distance between (x1,y1) and (x2,y2) is |x1-x2| + |y1-y2|.',
    ],
    solution: `fn min_cost_connect_points(points: &[(i64, i64)]) -> i64 {
    let n = points.len();
    if n == 0 { return 0; }
    let mut in_mst = vec![false; n];
    let mut min_dist = vec![i64::MAX; n];
    min_dist[0] = 0;
    let mut total = 0i64;
    for _ in 0..n {
        let u = (0..n).filter(|&i| !in_mst[i]).min_by_key(|&i| min_dist[i]).unwrap();
        in_mst[u] = true;
        total += min_dist[u];
        for v in 0..n {
            if !in_mst[v] {
                let d = (points[u].0 - points[v].0).abs() + (points[u].1 - points[v].1).abs();
                if d < min_dist[v] { min_dist[v] = d; }
            }
        }
    }
    total
}

fn main() {
    let pts = vec![(0i64,0),(2,2),(3,10),(5,2),(7,0)];
    assert_eq!(min_cost_connect_points(&pts), 20);
    let pts2 = vec![(0i64,0),(1,1),(1,0),(0,1)];
    assert_eq!(min_cost_connect_points(&pts2), 3);
    assert_eq!(min_cost_connect_points(&[]), 0);
    assert_eq!(min_cost_connect_points(&[(0i64,0)]), 0);
    println!("ok");
}`,
    starter: `fn min_cost_connect_points(points: &[(i64, i64)]) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_cost_connect_points(&[]), 0);
    println!("ok");
}`,
    tags: ['graph', 'mst', 'prims', 'greedy'],
  },
  {
    id: 'ds-ch11-c-028',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'All Paths from Source to Target in DAG',
    prompt: `Implement:

    fn all_paths_source_target(adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>>

Given a directed acyclic graph (DAG) of n nodes (0-indexed) as an adjacency list, return all paths from node 0 to node n-1. Return paths in any order. Return an empty Vec for an empty graph.
Example: adj=[[1,2],[3],[3],[]] -> [[0,1,3],[0,2,3]]`,
    hints: [
      'Recursive DFS backtracking: build the current path and record it when you reach n-1.',
      'No need for a visited set since the graph is a DAG (no cycles).',
    ],
    solution: `fn all_paths_source_target(adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    let n = adj.len();
    if n == 0 { return vec![]; }
    let target = n - 1;
    let mut all_paths = Vec::new();
    let mut path = vec![0usize];
    fn dfs(
        node: usize, target: usize,
        adj: &Vec<Vec<usize>>,
        path: &mut Vec<usize>,
        all_paths: &mut Vec<Vec<usize>>,
    ) {
        if node == target {
            all_paths.push(path.clone());
            return;
        }
        for &nb in &adj[node] {
            path.push(nb);
            dfs(nb, target, adj, path, all_paths);
            path.pop();
        }
    }
    dfs(0, target, adj, &mut path, &mut all_paths);
    all_paths
}

fn main() {
    let adj = vec![vec![1usize,2], vec![3], vec![3], vec![]];
    let mut paths = all_paths_source_target(&adj);
    paths.sort();
    assert_eq!(paths.len(), 2);
    assert_eq!(paths[0], vec![0,1,3]);
    assert_eq!(paths[1], vec![0,2,3]);
    let adj2 = vec![vec![1usize], vec![]];
    assert_eq!(all_paths_source_target(&adj2), vec![vec![0,1]]);
    assert_eq!(all_paths_source_target(&vec![]), vec![] as Vec<Vec<usize>>);
    println!("ok");
}`,
    starter: `fn all_paths_source_target(adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(all_paths_source_target(&vec![]), vec![] as Vec<Vec<usize>>);
    println!("ok");
}`,
    tags: ['graph', 'dfs', 'backtracking', 'dag', 'all-paths'],
  },
  {
    id: 'ds-ch11-c-029',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Jump Game IV: Minimum Jumps with Same-Value Teleport',
    prompt: `Implement:

    fn min_jumps(arr: &[i32]) -> i32

Given an integer array arr, start at index 0 and reach the last index in the minimum number of jumps. From index i you can jump to i-1, i+1, or any index j where arr[j] == arr[i]. Return 0 if already at the last index.
Example: arr=[100,-23,-23,404,100,23,23,23,3,404] -> 3`,
    hints: [
      'BFS where each state is an index; same-value teleports are extra neighbors.',
      'Remove a value from the teleport map once processed to avoid re-visiting the same group.',
    ],
    solution: `use std::collections::VecDeque;

fn min_jumps(arr: &[i32]) -> i32 {
    let n = arr.len();
    if n <= 1 { return 0; }
    let mut val_to_indices: std::collections::HashMap<i32, Vec<usize>> = std::collections::HashMap::new();
    for (i, &v) in arr.iter().enumerate() {
        val_to_indices.entry(v).or_default().push(i);
    }
    let mut visited = vec![false; n];
    visited[0] = true;
    let mut q = VecDeque::new();
    q.push_back((0usize, 0i32));
    while let Some((pos, steps)) = q.pop_front() {
        let mut candidates = Vec::new();
        if pos > 0 { candidates.push(pos - 1); }
        if pos + 1 < n { candidates.push(pos + 1); }
        if let Some(same) = val_to_indices.get(&arr[pos]) {
            for &idx in same {
                candidates.push(idx);
            }
            val_to_indices.remove(&arr[pos]);
        }
        for next in candidates {
            if next == n - 1 { return steps + 1; }
            if !visited[next] {
                visited[next] = true;
                q.push_back((next, steps + 1));
            }
        }
    }
    -1
}

fn main() {
    assert_eq!(min_jumps(&[100, -23, -23, 404, 100, 23, 23, 23, 3, 404]), 3);
    assert_eq!(min_jumps(&[7]), 0);
    assert_eq!(min_jumps(&[7, 6, 9, 6, 9, 6, 9, 7]), 1);
    assert_eq!(min_jumps(&[6, 1, 9]), 2);
    println!("ok");
}`,
    starter: `use std::collections::VecDeque;

fn min_jumps(arr: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_jumps(&[7]), 0);
    println!("ok");
}`,
    tags: ['graph', 'bfs', 'jump-game', 'hash-map'],
  },
  {
    id: 'ds-ch11-c-030',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Alien Dictionary: Topological Order of Characters',
    prompt: `Implement:

    fn alien_order(words: &[&str]) -> String

Given a sorted list of words from an alien language, deduce the lexicographic ordering of characters using topological sort. Return any valid ordering of all unique characters. Return an empty string if the ordering is impossible (e.g., a longer word is a prefix of a shorter word that follows it, or there is a cycle).
Example: words=["wrt","wrf","er","ett","rftt"] -> a valid 5-character order (e.g., "wertf" or similar).`,
    hints: [
      'Compare adjacent word pairs to derive character ordering edges; build a directed graph.',
      'Run Kahns topological sort; return empty string on cycle detection or invalid prefix ordering.',
    ],
    solution: `fn alien_order(words: &[&str]) -> String {
    use std::collections::{HashMap, HashSet, VecDeque};
    let mut adj: HashMap<char, HashSet<char>> = HashMap::new();
    let mut indegree: HashMap<char, usize> = HashMap::new();
    for w in words {
        for c in w.chars() {
            adj.entry(c).or_default();
            indegree.entry(c).or_insert(0);
        }
    }
    for pair in words.windows(2) {
        let (w1, w2) = (pair[0], pair[1]);
        let chars1: Vec<char> = w1.chars().collect();
        let chars2: Vec<char> = w2.chars().collect();
        if chars1.len() > chars2.len() && chars1[..chars2.len()] == chars2[..] {
            return String::new();
        }
        let min_len = chars1.len().min(chars2.len());
        for i in 0..min_len {
            if chars1[i] != chars2[i] {
                if !adj[&chars1[i]].contains(&chars2[i]) {
                    adj.get_mut(&chars1[i]).unwrap().insert(chars2[i]);
                    *indegree.get_mut(&chars2[i]).unwrap() += 1;
                }
                break;
            }
        }
    }
    let mut q = VecDeque::new();
    for (&c, &deg) in &indegree {
        if deg == 0 { q.push_back(c); }
    }
    let mut result = String::new();
    while let Some(c) = q.pop_front() {
        result.push(c);
        let neighbors: Vec<char> = adj[&c].iter().cloned().collect();
        for nb in neighbors {
            let d = indegree.get_mut(&nb).unwrap();
            *d -= 1;
            if *d == 0 { q.push_back(nb); }
        }
    }
    if result.len() != indegree.len() { String::new() } else { result }
}

fn main() {
    let words = vec!["wrt", "wrf", "er", "ett", "rftt"];
    let order = alien_order(&words);
    assert!(!order.is_empty(), "should have valid order");
    assert_eq!(order.len(), 5);
    let words2 = vec!["z", "x"];
    let order2 = alien_order(&words2);
    assert_eq!(order2.len(), 2);
    let pos_z = order2.chars().position(|c| c == 'z').unwrap();
    let pos_x = order2.chars().position(|c| c == 'x').unwrap();
    assert!(pos_z < pos_x);
    let words3 = vec!["abc", "ab"];
    assert_eq!(alien_order(&words3), "");
    println!("ok");
}`,
    starter: `fn alien_order(words: &[&str]) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(alien_order(&["abc","ab"]), "");
    println!("ok");
}`,
    tags: ['graph', 'topological-sort', 'kahns', 'alien-dictionary'],
  },
]

export default problems
