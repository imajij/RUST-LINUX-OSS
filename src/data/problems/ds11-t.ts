import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch11-t-001',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Vertices, Edges, and the Four Flavours',
    prompt: `A graph is "a set of things plus the connections between some of them". The things are called vertices (or nodes) and the connections are called edges.

Two independent yes/no choices give graphs their four flavours. Name the two choices, and explain why "directed" and "weighted" are NOT the same thing by giving one concrete example of a graph that is directed but unweighted.`,
    hints: [
      'One choice is about whether an edge points one way or both ways; the other is about whether each edge carries a number.',
      'Twitter follows and web links are good examples to think about.',
    ],
    solution: `The two independent choices are: (1) directed vs undirected, and (2) weighted vs unweighted. Directed means an edge has an arrow and points one way only (a digraph); undirected means an edge is a two-way street. Weighted means every edge carries a number (a cost like a road length or a flight price); unweighted means every edge counts the same (effectively weight 1). They are independent because you can pick either answer for one without affecting the other. A directed-but-unweighted example is Twitter-style "follows": if Ana follows Ben, that does not mean Ben follows Ana (so it is directed), but no follow is worth more than another (so it is unweighted). Confusing the two is a classic mistake; you can have any of the four combinations.`,
    tags: ['graph', 'directed', 'weighted'],
  },
  {
    id: 'ds-ch11-t-002',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Most Common Graph Bug',
    prompt: `A student builds an undirected graph as an adjacency list (a Vec of Vec of usize) like this:

    let mut adj = vec![Vec::new(); n];
    for &(u, v) in &edges {
        adj[u].push(v);
    }

They then run BFS from vertex 0 and are surprised that it cannot reach about half of the graph. What single line did they forget, and why does the symptom (half the graph unreachable) make sense?`,
    hints: [
      'For an undirected edge u-v, how many lists must mention the connection?',
      'An undirected edge means the connection goes both ways.',
    ],
    solution: `They forgot to push the edge in BOTH directions. For an undirected edge u-v the list code must do adj[u].push(v) AND adj[v].push(u). With only the first push, vertex u knows about v as a neighbour but v does not know about u, so the edge is effectively one-way. A traversal that arrives at v can never walk back the connection to u, so whole parts of the graph that are only reachable through such "backwards" edges become unreachable. That is exactly why roughly half the connections silently disappear. Pushing both directions is the single most important habit for undirected adjacency lists.`,
    tags: ['graph', 'adjacency-list', 'undirected'],
  },
  {
    id: 'ds-ch11-t-003',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'List, Edges, or Matrix?',
    prompt: `You must store a road network of a whole country: about 1,000,000 cities (vertices), and each city connects to only a handful of nearby cities, so there are only about 3,000,000 roads (edges) total.

Which of the three representations (adjacency list, edge list, adjacency matrix) should you choose, and which one is impossible here? Justify each answer in terms of memory.`,
    hints: [
      'Is this graph sparse or dense? Compare the number of edges to the maximum possible.',
      'An adjacency matrix always uses memory proportional to n squared.',
    ],
    solution: `This graph is extremely sparse: a million cities could in principle have up to roughly n-squared (a trillion) connections, but there are only three million. So you want the adjacency list (a Vec of Vec of usize). It uses O(n + m) memory, proportional to the graph's actual size, which here is a few million entries, and it lets BFS/DFS iterate a city's neighbours quickly. The adjacency matrix is impossible: it always uses O(n squared) memory regardless of how few edges exist, so for a million vertices it would need a million-by-million grid of cells, which is far too large to fit in memory. An edge list (O(m)) would also fit, but it is poor at answering "who are this city's neighbours?" because you would have to scan the whole list, so it is not the right default for traversal.`,
    tags: ['graph', 'adjacency-list', 'adjacency-matrix'],
  },
  {
    id: 'ds-ch11-t-004',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why BFS Finds the Shortest Path',
    prompt: `BFS explores a graph "in rings": all vertices at distance 1 from the start, then all at distance 2, then distance 3, and so on. The note claims that in an UNWEIGHTED graph this gives the shortest path (fewest edges) to every vertex.

Explain in your own words WHY the very first time BFS touches a vertex, it has reached it by the shortest possible route. Also state the one situation where this guarantee breaks.`,
    hints: [
      'BFS reaches all distance-1 vertices before any distance-2 vertex. What does that ordering guarantee?',
      'Think about what happens the moment edges start carrying different weights.',
    ],
    solution: `BFS processes vertices in strict ring order: it reaches every distance-1 vertex before any distance-2 vertex, every distance-2 before any distance-3, and so on. So if a vertex could be reached in k edges, BFS will have already touched it during ring k at the latest. That means the FIRST time BFS ever sees a vertex, no shorter route could have reached it earlier, because a shorter route would have been explored in an earlier ring. Therefore the distance recorded on first sight is final and minimal. The guarantee breaks the instant edges have different weights: then "fewest edges" is no longer the same as "lowest total cost", a path with more edges can be cheaper, and you need Dijkstra's algorithm instead. BFS gives the unweighted shortest path only.`,
    tags: ['graph', 'bfs', 'shortest-path'],
  },
  {
    id: 'ds-ch11-t-005',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Mark on Enqueue, Not on Dequeue',
    prompt: `The note insists: in BFS, mark a vertex visited the moment you ENQUEUE it (push it onto the queue), not when you later dequeue it (pop it to process).

Describe what goes wrong if you instead wait to mark a vertex visited until you dequeue it. Mention both the effect on the queue and on the distances.`,
    hints: [
      'If a vertex is not yet marked, can it be added to the queue more than once?',
      'Think about a vertex with several neighbours that all see it as unvisited before any of them is processed.',
    ],
    solution: `If you only mark a vertex when you dequeue it, then between the time it is first added and the time it is finally processed it still looks "unvisited" to everyone else. So several different neighbours can each enqueue the same vertex before it is ever popped. The queue then fills with duplicate copies of the same vertices, wasting memory and time, and in the worst case the queue blows up far beyond n entries. Worse, because the same vertex can be enqueued from different rings, you can record a distance from a later (longer) discovery and overwrite or use a wrong value, producing incorrect shortest distances. Marking visited on enqueue guarantees each vertex enters the queue exactly once, keeping the queue small and the first-recorded distance correct.`,
    tags: ['graph', 'bfs', 'pitfall'],
  },
  {
    id: 'ds-ch11-t-006',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace BFS, Then DFS',
    prompt: `Consider this undirected graph with edges added in this order, so each adjacency list is in ascending order:

    0-1, 0-2, 1-3, 1-4

(So adj[0] = [1,2], adj[1] = [0,3,4], adj[2] = [0], adj[3] = [1], adj[4] = [1].)

Give the visit order of BFS starting from vertex 0, then the visit order of RECURSIVE DFS starting from vertex 0 (always trying neighbours in list order). Why are they different even though both run in O(n + m)?`,
    hints: [
      'BFS pulls vertices from the front of a FIFO queue; DFS dives deep before backing up.',
      'For DFS, follow vertex 1 all the way before returning to look at vertex 2.',
    ],
    solution: `BFS from 0 visits in ring order: start with 0, then its neighbours 1 and 2 (ring 1), then 1's unvisited neighbours 3 and 4 (ring 2). So the BFS order is 0, 1, 2, 3, 4. Recursive DFS from 0 dives deep: visit 0, then its first neighbour 1, then from 1 its first unvisited neighbour 3 (dead end, back up), then 1's next unvisited neighbour 4 (dead end, back up), then finally back at 0 visit its next neighbour 2. So the DFS order is 0, 1, 3, 4, 2. They differ because BFS explores wide (nearest first) using a queue, while DFS explores deep (follow one path to the end first) using the call stack. The cost is the same O(n + m) because both touch every vertex once and every edge once; only the ORDER of visiting differs, not the amount of work.`,
    tags: ['graph', 'bfs', 'dfs'],
  },
  {
    id: 'ds-ch11-t-007',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Counting Islands in One Pass',
    prompt: `To count connected components you loop over every vertex 0..n, and whenever you hit an UNVISITED vertex you increment a counter and launch a full BFS/DFS flood from it.

A student worries this is slow: "If I launch a fresh traversal from many vertices, surely I re-walk the graph many times, so it must be worse than O(n + m)." Explain why the total cost across ALL the launches combined is still O(n + m), not more.`,
    hints: [
      'What does the shared visited array guarantee about how many times any single vertex gets flooded?',
      'A vertex that is already visited is skipped immediately by the outer loop.',
    ],
    solution: `The visited array is shared across every launch, not reset between them. Once a vertex is marked visited by some flood, no later flood (and not the outer loop) will ever process it again. So across ALL launches combined, each vertex is the starting point of expansion exactly once and each edge is examined exactly once, just like a single traversal. The outer loop does glance at all n vertices, but for already-visited ones it does O(1) work and skips. Adding it up: O(n) for the outer loop plus O(n + m) total for all the floods equals O(n + m) overall. The key insight is that "launch from each unvisited vertex" does not re-walk the graph; the visited array makes the launches partition the graph into disjoint pieces, so their work simply sums to one full traversal's worth.`,
    tags: ['graph', 'connected-components', 'complexity'],
  },
  {
    id: 'ds-ch11-t-008',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Gray Means Cycle, Black Does Not',
    prompt: `A directed cycle detector colours vertices white (unvisited), gray (on the current DFS path), or black (fully finished). Consider this directed graph:

    0 -> 1,  0 -> 2,  1 -> 2

Walk the DFS from vertex 0 (neighbours in list order). When DFS is back at vertex 0 about to follow the edge 0 -> 2, vertex 2 has already been visited. Is this a cycle? Explain using the colour of vertex 2 at that moment, and state the rule that distinguishes a real cycle from a harmless re-visit.`,
    hints: [
      'Trace which vertices finish (turn black) before you return to vertex 0.',
      'A cycle is only signalled by an edge into a vertex still ON the current path.',
    ],
    solution: `Trace it: colour 0 gray, follow 0 -> 1 and colour 1 gray, follow 1 -> 2 and colour 2 gray. Vertex 2 has no out-edges, so it finishes and turns BLACK; then 1 finishes and turns black. Now DFS is back at vertex 0 and follows 0 -> 2. At this moment vertex 2 is BLACK, meaning it is fully finished and is NOT on the current active path. So this is NOT a cycle; it is just a second, separate path that happens to reach the same already-finished vertex. The rule: a cycle exists only when DFS points at a GRAY vertex, one still on the current recursion stack (the path from the root down to where you are now), because that edge closes a loop back onto the live path. A black neighbour just means "two paths reached the same place", which is perfectly fine. Confusing "already visited" with "on the current path" is the classic bug.`,
    tags: ['graph', 'cycle-detection', 'dfs'],
  },
  {
    id: 'ds-ch11-t-009',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace Kahn and Spot the Cycle',
    prompt: `You run Kahn's topological-sort algorithm on this directed graph of 4 vertices:

    0 -> 1,  1 -> 2,  2 -> 1,  2 -> 3

(Edges point from prerequisite to dependent.)

Compute the initial in-degree of every vertex, seed the queue, and run Kahn's algorithm by hand. How many vertices get emitted, what does that tell you, and which vertices are the culprits?`,
    hints: [
      'In-degree counts how many edges point INTO a vertex; seed the queue with all in-degree-0 vertices.',
      'If the output has fewer than n vertices when the queue empties, what does that mean?',
    ],
    solution: `In-degrees: vertex 0 has 0 (nothing points in), vertex 1 has 2 (from 0 and from 2), vertex 2 has 1 (from 1), vertex 3 has 1 (from 2). Only vertex 0 has in-degree 0, so the queue starts as [0]. Pop 0, emit it, and decrement vertex 1's in-degree from 2 to 1; it is not yet 0, so nothing new is enqueued. The queue is now empty. Kahn's loop ends having emitted only 1 vertex out of 4. Because the output count (1) is less than n (4), the graph must contain a cycle and NO valid topological order exists. The culprits are vertices 1 and 2: the edges 1 -> 2 and 2 -> 1 form a cycle, so vertices 1, 2, and the vertex 3 that depends on them never reach in-degree 0 and are never emitted. Always check the emitted count; a short answer means a cycle.`,
    tags: ['graph', 'topological-sort', 'cycle-detection'],
  },
  {
    id: 'ds-ch11-t-010',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Union-Find Beats a Fresh Flood',
    prompt: `You are given a network and a long stream of operations, each either "connect machine a to machine b" or "are machines a and b connected right now?". There can be hundreds of thousands of such operations.

You could answer each "are they connected?" query by running a fresh BFS/DFS at that moment. Explain why Union-Find (Disjoint-Set Union) is the far better tool here, and name the two optimisations that make each operation effectively constant time. What does "amortised" mean in this claim?`,
    hints: [
      'How expensive is one BFS query, and how many queries might there be?',
      'The two optimisations are union by rank and path compression.',
    ],
    solution: `Answering each query with a fresh BFS/DFS costs O(n + m) per query, so hundreds of thousands of queries could cost hundreds of thousands times O(n + m), far too slow. Union-Find instead maintains the groups incrementally: each element points toward a root, find(x) climbs to the root, and two elements are connected exactly when they share a root; union merges two groups by hanging one root under the other. With both optimisations, each query and each merge is effectively constant time. The two optimisations are: union by rank (always attach the shorter tree under the taller one, keeping trees shallow) and path compression (during find, re-point every node you passed straight to the root, flattening the tree for next time). Together they give a per-operation cost of O(alpha(n)), where alpha grows so slowly it stays below 5 for any realistic n. "Amortised" means the cost is averaged over the whole long run of operations: a rare single operation might do a little extra work, but the average per operation is effectively constant.`,
    tags: ['graph', 'union-find', 'complexity'],
  },
  {
    id: 'ds-ch11-t-011',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'The usize Underflow at the Grid Edge',
    prompt: `A 2D grid is a graph in disguise: each cell is a vertex connected to its up/down/left/right neighbours. To visit the cell above (r, c) you compute (r - 1, c).

In Rust, r and c are usize. Explain precisely what goes wrong when r is 0 and you compute r - 1, in BOTH debug and release builds, and give the standard fix used in the note's flood-fill code.`,
    hints: [
      'usize is unsigned, so it cannot represent a value below zero. What happens instead?',
      'The fix is about the ORDER of the bounds check relative to the subtraction.',
    ],
    solution: `usize is an unsigned integer, so it can never hold a value below zero. When r is 0, computing r - 1 does NOT give -1. In a debug build the subtraction overflows and the program PANICS (crashes with an overflow message). In a release build the subtraction wraps around to a gigantic number (usize::MAX, near 18 quintillion), and using it as a row index then reads garbage off the edge of the grid or panics on the out-of-bounds index. Either way the flood-fill breaks. The standard fix is to bounds-check BEFORE you subtract: only compute the "up" neighbour when r > 0 (guard it with an "if r > 0" before doing r - 1), and similarly guard c > 0 before c - 1. The downward and rightward neighbours are safe to check after the fact (r + 1 < rows, c + 1 < cols) because addition cannot underflow. Alternatively you can cast to a signed type (isize) for the offset arithmetic and validate the result before indexing back. The point is: never subtract 1 from a usize that might be 0 without checking first.`,
    tags: ['graph', 'grid', 'usize-underflow'],
  },
  {
    id: 'ds-ch11-t-012',
    chapter: 11,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Recursive DFS and the Stack Overflow',
    prompt: `Recursive DFS is short and beautiful: a function marks the current vertex visited, then calls itself on each unvisited neighbour. The note warns it can crash on certain graphs that the iterative version handles fine.

Describe the exact shape of graph that makes recursive DFS dangerous, explain what concretely fails (and why Rust cannot cleanly recover from it), and say which DFS variant you would use instead and why it is immune.`,
    hints: [
      'Recursion depth equals how deep the DFS path goes. What graph shape maximises that depth?',
      'The iterative version keeps its working set in a different place than the call stack.',
    ],
    solution: `The dangerous shape is a very deep, chain-like (linked-list-shaped) graph: vertex 0 connects to 1, 1 to 2, 2 to 3, and so on for, say, 100000 vertices. Recursive DFS follows that chain without ever backing up, so it makes one nested function call per vertex, building a recursion depth of 100000. Each call consumes a frame on the program's call stack, and the default stack is only about 8 MB, so a deep enough chain overflows it. When the call stack overflows, Rust ABORTS the whole program immediately; a stack overflow is not a normal panic and there is no clean way to catch it or unwind from it. The fix is the iterative DFS that manages its OWN stack with a Vec (push and pop), running a loop instead of recursing. It is immune because its working set lives on the heap (the Vec) rather than on the limited call stack, so it can grow to millions of entries without overflowing. The visit order differs slightly from the recursive version, but it is still a valid DFS, so on graphs that might be deep you reach for the explicit-stack version.`,
    tags: ['graph', 'dfs', 'recursion-depth'],
  },
]

export default problems
