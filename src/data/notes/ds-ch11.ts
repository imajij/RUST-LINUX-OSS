import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-11',
  track: 'dsa',
  chapter: 11,
  title: 'Graphs',
  summary: `A graph is the most general data structure for relationships: a set of things, and the connections between them. Once you can see graphs, you start spotting them everywhere — friends on a social network, roads between cities, packages that depend on other packages, courses that require prerequisites, and even the pixels of an image in a paint program. This chapter builds graphs from scratch in Rust: how to draw them, how to store them (adjacency list, edge list, adjacency matrix) and the trade-offs of each, and then the two workhorse traversals, breadth-first search and depth-first search, that almost every other graph algorithm is built on.

From those two traversals we get a surprising amount of power for free: BFS finds the shortest path in an unweighted graph, DFS counts connected components and detects cycles, Kahn's algorithm topologically sorts a dependency graph so a build system knows what to compile first, and Union-Find answers "are these two things connected?" in nearly constant time. We finish by treating a 2D grid as a graph in disguise, which is exactly how flood-fill colours a region in a paint program. Everything here is idiomatic Rust — Vec, a Vec of bool as a fast visited marker, VecDeque for the BFS queue, and a healthy respect for usize, which (unlike a signed integer in C++ or Python) can never go below zero.`,
  sections: [
    {
      heading: 'What a graph is: vertices, edges, and the four flavours',
      body: `Picture a small group of friends. Draw a dot for each person and a line between any two people who know each other. You have just drawn a **graph**. The dots are called **vertices** (singular *vertex*) or **nodes**; the lines are called **edges**. That is the entire definition: a graph is a set of vertices plus a set of edges, where each edge joins two vertices.

The reason graphs are everywhere is that "a set of things, plus connections between some of them" describes an astonishing range of problems. Cities joined by roads. Web pages joined by links. Atoms joined by bonds. Tasks joined by "must finish A before B". The moment you can phrase a problem as vertices-and-edges, every algorithm in this chapter becomes available to you.

Graphs come in four flavours, formed by two independent yes/no choices:

- **Directed vs undirected.** In an *undirected* graph an edge is a two-way street: if Ana is friends with Ben, Ben is friends with Ana. In a *directed* graph (a *digraph*) each edge has an arrow and points one way only: "page A links to page B" does not mean B links back. Twitter-style "follows" are directed; Facebook-style "friends" are undirected.
- **Weighted vs unweighted.** In a *weighted* graph every edge carries a number, its *weight* or *cost* — the length of a road, the price of a flight, the latency of a network link. In an *unweighted* graph every edge counts the same (effectively weight 1), and "distance" just means *number of edges*.

A couple of terms you will meet constantly: two vertices joined by an edge are **adjacent** (they are **neighbours**); the **degree** of a vertex is how many edges touch it; and a **path** is a sequence of vertices each joined to the next by an edge.

### Common pitfalls

- Confusing *directed* with *weighted*. They are independent: you can have a directed unweighted graph, an undirected weighted graph, or any combination.
- Assuming edges are unique. A *multigraph* allows several edges between the same pair, and a *self-loop* is an edge from a vertex to itself. Most introductory problems forbid both, but always check.`,
      code: [
        {
          lang: 'text',
          src: `UNDIRECTED (friendship)        DIRECTED (who follows whom)

      Ana                            Ana
     /   \\                          /   \\
    /     \\                        v     v
  Ben-----Cy                      Ben --> Cy
    \\     /
     \\   /
      Dan

  edges have no arrows;          edges are one-way arrows;
  Ana--Ben means BOTH            Ana->Ben and Ana->Cy and
  know each other.               Ben->Cy. Ben->Cy does NOT
                                 imply Cy->Ben.


WEIGHTED (road distances, km)

      Ana
    7/    \\3
    /      \\
  Ben--10--Cy
   the number on each edge is its cost / weight.`
        }
      ]
    },
    {
      heading: 'Three ways to store a graph, and when to use each',
      body: `A picture is nice for humans, but a program needs the graph in memory. There are three standard representations, and choosing well is one of the most consequential decisions you make. Let *n* be the number of vertices and *m* the number of edges. We will label vertices with the integers 0, 1, 2, ... up to n minus 1, because integers make perfect array indices.

**1. Adjacency list — the default, used in 90% of problems.** For each vertex you store a list of its neighbours. In Rust this is naturally a *Vec of Vec of usize*: outer index is the vertex, inner Vec is its neighbours. It uses O(n + m) memory — proportional to the graph's actual size — and lets you iterate a vertex's neighbours in time proportional to how many it has. This is exactly what BFS and DFS want.

**2. Edge list — the simplest, just a list of pairs.** You store a flat *Vec of (u, v)* (add a weight to make it a triple). It uses O(m) memory and is trivial to build. It is poor for "who are u's neighbours?" because you must scan the whole list, but it is the *natural* input for algorithms that process every edge once — most famously Union-Find and Kruskal's minimum-spanning-tree.

**3. Adjacency matrix — a grid of booleans.** A 2D array where cell [u][v] is true (or holds the weight) when an edge u-to-v exists. Checking "is there an edge u-v?" is instant, O(1). The catch is memory: it always uses O(n squared), even if there are only a handful of edges. Use it only for *dense* graphs (m near n squared) or small n.

The deciding question is **density**. A *sparse* graph has far fewer edges than the n-squared maximum (a road network — each city touches a few neighbours, not all of them); a *dense* graph has nearly every possible edge. Sparse favours the adjacency list; dense favours the matrix.

### Common pitfalls

- For an **undirected** edge u-v in an adjacency list you must push *both* directions: u into v's list and v into u's list. Forgetting one half is the single most common graph bug, and the symptom is a traversal that mysteriously cannot reach half the graph.
- An adjacency matrix for n = 100000 vertices needs 10 billion cells. It will not fit in memory. When n is large and the graph is sparse, the matrix is simply not an option.`,
      code: [
        {
          lang: 'text',
          src: `Same graph, three storage formats.   Vertices 0..3, edges below.

        0
       / \\          undirected edges:  0-1, 0-2, 1-2, 2-3
      1---2
           \\
            3

ADJACENCY LIST            EDGE LIST          ADJACENCY MATRIX
(Vec<Vec<usize>>)         (Vec<(u,v)>)       (n x n of bool)
                                                  0 1 2 3
 0 -> [1, 2]              [ (0,1),            0 [ 0 1 1 0 ]
 1 -> [0, 2]                (0,2),            1 [ 1 0 1 0 ]
 2 -> [0, 1, 3]            (1,2),            2 [ 1 1 0 1 ]
 3 -> [2]                  (2,3) ]           3 [ 0 0 1 0 ]

 O(n + m) memory          O(m) memory        O(n^2) memory
 best default             best for           best when DENSE
                          edge-by-edge        / tiny n`
        },
        {
          lang: 'rust',
          src: `// Build the same undirected graph in all three representations.
fn main() {
    let n = 4;
    let edges = [(0usize, 1usize), (0, 2), (1, 2), (2, 3)];

    // 1) Adjacency list: Vec<Vec<usize>>. The everyday choice.
    let mut adj = vec![Vec::new(); n];
    for &(u, v) in &edges {
        adj[u].push(v);
        adj[v].push(u); // UNDIRECTED: push BOTH directions!
    }
    // adj[2] == [0, 1, 3]: the neighbours of vertex 2.

    // 2) Edge list: just keep the pairs. Great for Union-Find / Kruskal.
    let edge_list: Vec<(usize, usize)> = edges.to_vec();

    // 3) Adjacency matrix: n x n grid of bool. O(1) edge lookup.
    let mut mat = vec![vec![false; n]; n];
    for &(u, v) in &edges {
        mat[u][v] = true;
        mat[v][u] = true; // again, both directions for undirected
    }

    assert_eq!(adj[2], vec![0, 1, 3]);
    assert_eq!(edge_list.len(), 4);
    assert!(mat[2][3]);          // O(1): is there an edge 2-3? yes.
    assert!(!mat[0][3]);         // O(1): edge 0-3? no.
}`
        }
      ]
    },
    {
      heading: 'Breadth-first search: explore in rings, find shortest paths',
      anim: 'graph-bfs',
      body: `**Breadth-first search (BFS)** explores a graph the way ripples spread on a pond. Start at a vertex, visit all of its direct neighbours (distance 1), then all of *their* unvisited neighbours (distance 2), and so on — outward in rings, nearest first. The real-world picture: "friends of friends" suggestions on a social network. Your direct friends are ring 1; their friends you do not yet know are ring 2, and those are exactly the people worth suggesting.

To explore nearest-first you need a structure that hands back items in the order you discovered them — *first in, first out*. That is a **queue**. In Rust the right tool is **VecDeque**, a double-ended queue: push new vertices on the back with push_back, take the next one to process from the front with pop_front. You also need a **visited** marker so you never enqueue the same vertex twice (graphs have cycles; without this you would loop forever). For vertices numbered 0..n a plain *Vec of bool* is the fast, cache-friendly choice.

Here is the property that makes BFS a star: **in an unweighted graph, BFS finds the shortest path** — the fewest edges — from the start to every other vertex. *Why?* Because BFS reaches all distance-1 vertices before any distance-2 vertex, and all distance-2 before any distance-3. So the *first* time you ever touch a vertex, you have reached it by the shortest possible route. Record the distance when you first enqueue a vertex and it is final. The cost is O(n + m): every vertex is enqueued once and every edge is looked at once.

### Common pitfalls

- **Mark visited when you ENQUEUE, not when you dequeue.** If you wait until you pop a vertex, you can enqueue it many times before processing it, blowing up the queue and sometimes producing wrong distances.
- BFS only gives shortest paths when **all edges count equally**. The instant edges have different weights, BFS is wrong and you need Dijkstra's algorithm (next chapter). BFS is the *unweighted* shortest path.
- usize distances: there is no natural "infinity". Use Option (None means "not yet reached") or a sentinel like usize::MAX, and remember usize::MAX plus one wraps around in release mode.`,
      code: [
        {
          lang: 'text',
          src: `BFS from vertex 0. Queue is FIFO (front on the left).
visited marks who has ever entered the queue. dist = ring number.

   graph:        0 --- 1 --- 3
                 |     |
                 2 --- 4

frame 0  start: enqueue 0, dist[0]=0
   queue: [0]                    visited: {0}

frame 1  pop 0 -> look at 1,2 (both new): enqueue, dist=1
   queue: [1, 2]                 visited: {0,1,2}
   dist:  0:0 1:1 2:1

frame 2  pop 1 -> neighbours 0(seen),3(new),4(new): enqueue, dist=2
   queue: [2, 3, 4]             visited: {0,1,2,3,4}
   dist:  0:0 1:1 2:1 3:2 4:2

frame 3  pop 2 -> neighbours 0(seen),4(seen): nothing new
   queue: [3, 4]

frame 4  pop 3 -> neighbour 1(seen): nothing new
   queue: [4]

frame 5  pop 4 -> neighbours 1,2(seen): nothing new
   queue: []   DONE.  Shortest #edges from 0: {0:0,1:1,2:1,3:2,4:2}`
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

// BFS shortest distance (in edges) from start to every vertex.
// dist[v] = None means v is unreachable from start.
fn bfs(adj: &[Vec<usize>], start: usize) -> Vec<Option<u32>> {
    let n = adj.len();
    let mut dist = vec![None; n];
    let mut queue = VecDeque::new();

    dist[start] = Some(0);
    queue.push_back(start);          // start ring 0

    while let Some(u) = queue.pop_front() {   // FIFO: take from the front
        let d = dist[u].unwrap();
        for &v in &adj[u] {
            if dist[v].is_none() {   // first time we see v == shortest route
                dist[v] = Some(d + 1);
                queue.push_back(v);  // mark-on-ENQUEUE: dist acts as visited
            }
        }
    }
    dist
}

fn main() {
    // 0-1, 0-2, 1-3, 1-4, 2-4 (undirected)
    let mut adj = vec![Vec::new(); 5];
    for &(u, v) in &[(0,1),(0,2),(1,3),(1,4),(2,4)] {
        adj[u].push(v);
        adj[v].push(u);
    }
    let dist = bfs(&adj, 0);
    assert_eq!(dist, vec![Some(0), Some(1), Some(1), Some(2), Some(2)]);
}`
        }
      ]
    },
    {
      heading: 'Depth-first search: go deep first, two ways to write it',
      body: `**Depth-first search (DFS)** is BFS's adventurous sibling. Instead of fanning out in rings, it picks one neighbour and dives as deep as it can, only backing up when it hits a dead end (a vertex with no unvisited neighbours). Picture exploring a maze by always taking the first unexplored corridor and following it to the end, then retreating to the last junction with an unexplored option. That "follow to the end, then back up" behaviour is exactly DFS.

DFS comes in two equivalent forms:

- **Recursive.** The call stack *is* your stack. You write a function that marks the current vertex visited, then calls itself on each unvisited neighbour. It is short and beautiful. The danger is that a very deep graph (think a chain of 100000 vertices) can overflow the program's call stack — Rust will abort with a stack overflow, with no clean way to catch it.
- **Explicit stack.** You manage your own stack with a *Vec* and push_back/pop. This is iterative, never overflows the call stack, and is what you reach for on huge graphs. The visit order differs slightly from the recursive version but it is still a valid DFS.

Both run in O(n + m): each vertex is visited once, each edge examined once — the same budget as BFS. The difference between BFS and DFS is *order*, not cost. The rule of thumb: use **BFS when you care about shortest paths or levels**; use **DFS when you care about reachability, structure, cycles, or finishing-order** (which powers connected components, cycle detection, and topological sort, all coming up).

### Common pitfalls

- **Recursion depth.** A linked-list-shaped graph of length 100000 will overflow the default 8 MB stack. If the graph might be deep, use the explicit-stack version.
- Mark a vertex visited the moment you first reach it. In the explicit-stack version a vertex can be pushed more than once before it is popped, so check visited again *after* popping, or you will process it twice.
- DFS does *not* give shortest paths. The first DFS route to a vertex can be far longer than necessary. Only BFS guarantees fewest edges.`,
      code: [
        {
          lang: 'text',
          src: `DFS from 0 on:   0 - 1 - 3
                 |   |
                 2   4
neighbour order follows the adjacency list. -> = recurse deeper,
<- = dead end, back up.

  visit 0          stack of calls:  [0]
   -> visit 1                       [0,1]
       -> visit 3                   [0,1,3]
           <- 3 done (no new)       [0,1]
       -> visit 4                   [0,1,4]
           <- 4 done                [0,1]
       <- 1 done                    [0]
   -> visit 2                       [0,2]
       <- 2 done                    [0]
  <- 0 done                         []

visit order: 0, 1, 3, 4, 2   (deep before wide -- compare to BFS!)`
        },
        {
          lang: 'rust',
          src: `// (A) Recursive DFS: the call stack does the bookkeeping.
fn dfs_rec(adj: &[Vec<usize>], u: usize, visited: &mut [bool], order: &mut Vec<usize>) {
    visited[u] = true;       // mark on first arrival
    order.push(u);
    for &v in &adj[u] {
        if !visited[v] {
            dfs_rec(adj, v, visited, order);  // dive deeper
        }
    }
}

// (B) Iterative DFS: our own Vec stack, safe for very deep graphs.
fn dfs_iter(adj: &[Vec<usize>], start: usize) -> Vec<usize> {
    let mut visited = vec![false; adj.len()];
    let mut stack = vec![start];          // LIFO: push/pop the back
    let mut order = Vec::new();
    while let Some(u) = stack.pop() {
        if visited[u] { continue; }       // may have been pushed twice
        visited[u] = true;
        order.push(u);
        for &v in &adj[u] {
            if !visited[v] { stack.push(v); }
        }
    }
    order
}

fn main() {
    let mut adj = vec![Vec::new(); 5];
    for &(u, v) in &[(0,1),(0,2),(1,3),(1,4)] { adj[u].push(v); adj[v].push(u); }
    let mut visited = vec![false; 5];
    let mut order = Vec::new();
    dfs_rec(&adj, 0, &mut visited, &mut order);
    assert_eq!(order, vec![0, 1, 3, 4, 2]);   // recursive deep-first order

    // The iterative version is ALSO a valid DFS, but the stack pops the
    // last-pushed neighbour first, so the order differs -- that is fine.
    assert_eq!(dfs_iter(&adj, 0), vec![0, 2, 1, 4, 3]);
}`
        }
      ]
    },
    {
      heading: 'Connected components: how many separate islands?',
      body: `A graph need not be one connected piece. Imagine a friendship network that actually contains three unrelated friend-circles that never met — three little islands of people. Each maximal "everyone-can-reach-everyone" island is a **connected component**. Counting them answers questions like "how many separate clusters are in this social network?" or "is the whole network one piece, or has it fragmented?"

The algorithm is a beautifully simple use of traversal. Walk over every vertex 0..n. If a vertex has *not* been visited yet, it must belong to a brand-new component you have not explored — so increment your component counter and launch a full BFS or DFS from it, which floods and marks the entire island. By the time you reach the next unvisited vertex, you are guaranteed to be standing on a fresh island. When the outer loop ends, the counter is your answer.

The cost is still O(n + m) overall, not more — even though it looks like you might re-traverse, the visited array guarantees each vertex and edge is touched exactly once across *all* the launches combined. This pattern — "loop over all vertices, traverse from each unvisited one" — is the standard way to handle a graph that may be disconnected, and you will reuse it for cycle detection and topological sort too.

### Common pitfalls

- Forgetting that the graph may be disconnected and only traversing from vertex 0. You would miss every other island. Always loop over *all* vertices in the outer loop.
- For a *directed* graph, plain reachability gives **weakly** connected pieces, not the stronger notion of "everyone can reach everyone both ways" (*strongly connected components*), which needs a fancier algorithm (Tarjan's or Kosaraju's). "Connected components" in the simple sense is an *undirected* idea.`,
      code: [
        {
          lang: 'text',
          src: `Three islands among vertices 0..6:

   0 --- 1        3        5 --- 6
   |               \\
   2                4

outer loop visits vertices in order; * = launches a new flood:

  v=0  unvisited * -> flood reaches {0,1,2}     components = 1
  v=1  visited, skip
  v=2  visited, skip
  v=3  unvisited * -> flood reaches {3,4}       components = 2
  v=4  visited, skip
  v=5  unvisited * -> flood reaches {5,6}       components = 3
  v=6  visited, skip

  ANSWER: 3 connected components.`
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

// Count connected components of an UNDIRECTED graph.
fn count_components(adj: &[Vec<usize>]) -> usize {
    let n = adj.len();
    let mut visited = vec![false; n];
    let mut components = 0;

    for start in 0..n {                 // loop over EVERY vertex
        if visited[start] { continue; } // already part of a found island
        components += 1;                // new island discovered
        // flood it with BFS (DFS works equally well)
        let mut q = VecDeque::from([start]);
        visited[start] = true;
        while let Some(u) = q.pop_front() {
            for &v in &adj[u] {
                if !visited[v] {
                    visited[v] = true;
                    q.push_back(v);
                }
            }
        }
    }
    components
}

fn main() {
    // edges: 0-1, 0-2, 3-4, 5-6  => three islands
    let mut adj = vec![Vec::new(); 7];
    for &(u, v) in &[(0,1),(0,2),(3,4),(5,6)] { adj[u].push(v); adj[v].push(u); }
    assert_eq!(count_components(&adj), 3);
}`
        }
      ]
    },
    {
      heading: 'Cycle detection: does the graph loop back on itself?',
      body: `A **cycle** is a path that returns to where it started — A to B to C and back to A. Detecting cycles matters constantly: a build system or package manager must reject a *circular dependency* (crate A needs B, B needs C, C needs A — impossible to build); a spreadsheet must refuse a formula that refers to itself; a course catalogue must not list two courses as each other's prerequisite. A graph with no cycles at all is called **acyclic**, and a directed acyclic graph gets its own famous abbreviation, **DAG**, which the next section needs.

The technique depends on whether the graph is directed:

- **Undirected.** Run DFS carrying the *parent* — the vertex you came from. If you reach an already-visited neighbour that is *not* your parent, you have found a second way back into the visited set: that is a cycle. (You ignore the parent because the edge you just walked back is not a real cycle, just the same edge in reverse.)
- **Directed.** The parent trick is not enough; you need to know whether a vertex is *currently on the recursion stack* — the path of vertices from the root down to where you are now. Give each vertex one of three colours: **white** (unvisited), **gray** (visited and still on the active path), **black** (fully finished). If DFS ever points at a **gray** vertex, that edge closes a loop back onto the current path: a cycle. This three-colour idea is one of the most useful in all of graph theory.

Both run in O(n + m). Remember to launch from every unvisited vertex, since the cycle might live in a component you have not started yet.

### Common pitfalls

- In the **undirected** case you must skip the *single* edge back to your parent — but be careful with multi-edges: if there are two separate edges between u and its parent, that genuinely is a cycle, so skip the parent only *once*.
- In the **directed** case, a *black* (finished) neighbour is **not** a cycle — you have merely found two paths to the same place. Only a **gray** neighbour, one still on the current stack, signals a cycle. Confusing "already visited" with "on the current path" is the classic bug.`,
      code: [
        {
          lang: 'text',
          src: `DIRECTED cycle hunt with white / gray / black.
gray = on the path I am currently walking.

  graph:  0 -> 1 -> 2 -> 0     (a 3-cycle)
                    \\-> 3

  visit 0  color: 0=gray                 path: [0]
   -> 1    color: 0=gray 1=gray          path: [0,1]
       -> 2 color: ...2=gray             path: [0,1,2]
           -> edge 2->0 : 0 is GRAY  =>  CYCLE FOUND!
                          (0 is still on the active path)

Contrast -- NOT a cycle:
  0 -> 1 ,  0 -> 2 ,  1 -> 2
  visiting 0->1->2 finishes 2 (BLACK). Back at 0, edge 0->2
  points to a BLACK vertex: just a second path, no cycle.`
        },
        {
          lang: 'rust',
          src: `#[derive(Clone, Copy, PartialEq)]
enum Color { White, Gray, Black }

// Detect a cycle in a DIRECTED graph via the 3-color DFS.
fn has_cycle_directed(adj: &[Vec<usize>]) -> bool {
    let n = adj.len();
    let mut color = vec![Color::White; n];

    fn dfs(u: usize, adj: &[Vec<usize>], color: &mut [Color]) -> bool {
        color[u] = Color::Gray;                 // u is now on the path
        for &v in &adj[u] {
            match color[v] {
                Color::Gray => return true,     // edge into the active path
                Color::White => {
                    if dfs(v, adj, color) { return true; }
                }
                Color::Black => {}              // finished elsewhere: fine
            }
        }
        color[u] = Color::Black;                // u fully explored
        false
    }

    for s in 0..n {                             // every component
        if color[s] == Color::White && dfs(s, adj, &mut color) {
            return true;
        }
    }
    false
}

fn main() {
    let cyclic = vec![vec![1], vec![2], vec![0]];      // 0->1->2->0
    let acyclic = vec![vec![1, 2], vec![2], vec![]];   // a DAG
    assert!(has_cycle_directed(&cyclic));
    assert!(!has_cycle_directed(&acyclic));
}`
        }
      ]
    },
    {
      heading: 'Topological sort: ordering a DAG with Kahn\'s algorithm',
      body: `Suppose you must take university courses, and some require others first: you cannot take *Algorithms* before *Data Structures*. Or a build system must compile libraries before the program that links them. In both cases you need to lay all the items in a single line so that **every prerequisite comes before the thing that needs it**. That ordering is a **topological sort** (or *topo sort*), and it exists for exactly the directed acyclic graphs — DAGs. (If there were a cycle, A would have to come before B and B before A: impossible. So a topo sort exists *if and only if* the graph has no cycle, which makes topo sort a cycle detector too.)

The cleanest method is **Kahn's algorithm**, built on the idea of **in-degree**: the in-degree of a vertex is how many edges point *into* it — how many prerequisites it still has waiting. The algorithm:

1. Compute every vertex's in-degree.
2. Any vertex with in-degree 0 has no unmet prerequisites — it is ready *now*. Put all such vertices in a queue.
3. Repeatedly pop a ready vertex, append it to the output order, and "remove" it by decrementing the in-degree of each vertex it points to. Whenever some vertex's in-degree drops to 0, all *its* prerequisites are now done, so enqueue it.
4. When the queue empties, if you have emitted all n vertices you have a valid order; if you emitted fewer, the leftover vertices form a cycle (so no order exists).

It runs in O(n + m) — each vertex enqueued once, each edge relaxed once. The output is a legal schedule; there can be several valid ones, and which you get depends on the queue order.

### Common pitfalls

- **Cycles produce a short answer.** If Kahn's loop ends and the output has fewer than n vertices, the graph had a cycle and no topo order exists. Always check the count — silently returning a partial order is a nasty bug.
- Edge direction is the whole game: the edge must point **from prerequisite to dependent** (Data Structures -> Algorithms). Reverse it by mistake and you get the schedule backwards.
- A queue gives *a* valid order; if you need the lexicographically smallest order, swap the VecDeque for a min-heap (BinaryHeap with std::cmp::Reverse).`,
      code: [
        {
          lang: 'text',
          src: `Courses (edge = "must come before"):
   DS -> ALGO ,  DS -> DB ,  ALGO -> ML ,  DB -> ML

initial in-degree (arrows pointing IN):
   DS:0   ALGO:1   DB:1   ML:2

queue = [DS]              (only in-degree 0)        out: []
 pop DS  -> dec ALGO(1->0), DB(1->0); enqueue both
   queue=[ALGO, DB]                                 out: [DS]
 pop ALGO-> dec ML(2->1)
   queue=[DB]                                       out: [DS,ALGO]
 pop DB  -> dec ML(1->0); enqueue ML
   queue=[ML]                                       out: [DS,ALGO,DB]
 pop ML  -> nothing points out
   queue=[]                                         out: [DS,ALGO,DB,ML]

emitted 4 of 4  => valid order:  DS, ALGO, DB, ML`
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

// Kahn's topological sort. Returns Some(order) for a DAG,
// or None if the graph contains a cycle.
fn topo_sort(adj: &[Vec<usize>]) -> Option<Vec<usize>> {
    let n = adj.len();
    let mut indeg = vec![0usize; n];
    for u in 0..n {
        for &v in &adj[u] {
            indeg[v] += 1;            // count edges pointing INTO v
        }
    }

    // Seed the queue with everything that has no prerequisites.
    let mut queue: VecDeque<usize> =
        (0..n).filter(|&v| indeg[v] == 0).collect();
    let mut order = Vec::with_capacity(n);

    while let Some(u) = queue.pop_front() {
        order.push(u);
        for &v in &adj[u] {
            indeg[v] -= 1;           // one prerequisite of v is now done
            if indeg[v] == 0 {       // all of v's prerequisites satisfied
                queue.push_back(v);
            }
        }
    }

    if order.len() == n { Some(order) } else { None } // short => cycle
}

fn main() {
    // 0=DS 1=ALGO 2=DB 3=ML.  DS->ALGO, DS->DB, ALGO->ML, DB->ML
    let adj = vec![vec![1, 2], vec![3], vec![3], vec![]];
    let order = topo_sort(&adj).unwrap();
    assert_eq!(order[0], 0);          // DS must be first
    assert_eq!(*order.last().unwrap(), 3); // ML must be last
}`
        }
      ]
    },
    {
      heading: 'Union-Find: the near-instant "are these connected?" structure',
      body: `Some problems do not need a full traversal; they only ask, over and over, **"are these two things in the same group?"** and **"merge these two groups."** Think of friend circles forming as people are introduced one pair at a time, or a network whose cables are added one by one while you keep asking whether two machines can already reach each other. The perfect tool is **Union-Find**, also called **Disjoint-Set Union (DSU)**.

The idea: every element starts in its own group. Each group is a little tree, and each element points to a **parent**; following parents up leads to the group's **root**, which is the group's identity. Two operations:

- **find(x)** — climb to the root of x's tree. Two elements are in the same group exactly when they share a root.
- **union(a, b)** — find both roots and, if different, hang one root under the other, merging the two trees into one.

Done naively the trees can grow into long chains and find becomes slow. Two cheap optimisations fix this and make Union-Find astonishingly fast:

1. **Union by rank** — always attach the *shorter* tree under the *taller* one, so trees stay shallow.
2. **Path compression** — during find, after reaching the root, re-point every node you passed straight to the root, flattening the tree for next time.

With both, the *amortised* cost per operation is effectively constant — written O(alpha(n)), where alpha is the inverse Ackermann function, which is below 5 for any n you will ever meet. ("*Amortised*" means: averaged over a long run of operations, even though one rare operation might do a little more work.) Union-Find is the engine behind Kruskal's minimum-spanning-tree algorithm and any "count the components as edges arrive" problem.

### Common pitfalls

- **Always union the ROOTS, never the raw elements.** union must call find on both arguments first; hanging a non-root under another node corrupts the structure.
- Skipping the optimisations. Without path compression *and* union by rank you can get O(n) chains, turning a supposedly instant operation slow. Use both.
- It is great at *adding* connections and querying, but it cannot easily *remove* an edge — Union-Find only merges, it never splits. If your problem deletes edges, a different approach is needed.`,
      code: [
        {
          lang: 'text',
          src: `union(0,1), union(2,3), union(1,3). parent arrows point up to root.

after 0-1:      after 2-3:      after union(1,3):
                                root(1)=0, root(3)=2, attach 2 under 0
   0   2  3        0    2          0
   ^               ^    ^         / \\
   1               1    3        1   2
                                     ^
                                     3
  groups: {0,1} {2} {3}   {0,1} {2,3}      {0,1,2,3}  -- all connected

PATH COMPRESSION on find(3):
   walk 3 -> 2 -> 0 (root), then re-point 3 and 2 straight to 0:

        0                next find(3) is one hop, not three.
      / | \\
     1  2  3`
        },
        {
          lang: 'rust',
          src: `// Disjoint-Set Union with path compression + union by rank.
struct DSU {
    parent: Vec<usize>,
    rank: Vec<u8>,        // upper bound on tree height
}

impl DSU {
    fn new(n: usize) -> Self {
        DSU { parent: (0..n).collect(), rank: vec![0; n] } // each its own root
    }

    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            let root = self.find(self.parent[x]);
            self.parent[x] = root;          // PATH COMPRESSION: point to root
        }
        self.parent[x]
    }

    // Returns false if a, b were already in the same set.
    fn union(&mut self, a: usize, b: usize) -> bool {
        let (ra, rb) = (self.find(a), self.find(b));
        if ra == rb { return false; }
        // UNION BY RANK: shorter tree hangs under the taller one.
        match self.rank[ra].cmp(&self.rank[rb]) {
            std::cmp::Ordering::Less    => self.parent[ra] = rb,
            std::cmp::Ordering::Greater => self.parent[rb] = ra,
            std::cmp::Ordering::Equal   => { self.parent[rb] = ra; self.rank[ra] += 1; }
        }
        true
    }
}

fn main() {
    let mut dsu = DSU::new(4);
    dsu.union(0, 1);
    dsu.union(2, 3);
    assert!(dsu.find(0) != dsu.find(2)); // two separate groups
    dsu.union(1, 3);                     // merge them
    assert!(dsu.find(0) == dsu.find(2)); // now all connected
}`
        }
      ]
    },
    {
      heading: 'Grids as graphs: flood-fill and the implicit graph',
      body: `Here is the trick that unlocks a huge family of problems: **a 2D grid is a graph in disguise.** Each cell is a vertex, and each cell is connected to its neighbours — usually the 4 up/down/left/right cells (sometimes 8, if diagonals count). You never build an adjacency list at all; the edges are *implicit*, computed on the fly from the coordinates. This is called an **implicit graph**: the neighbours of cell (r, c) are simply the in-bounds cells around it.

The headline application is **flood-fill** — the paint bucket in an image editor. You click a pixel; the tool repaints that pixel and every same-coloured pixel reachable through neighbours, stopping at the boundary where the colour changes. That is just BFS or DFS over the grid graph: start at the clicked cell, walk to same-colour neighbours, recolour as you go. The same template solves "count islands of land in a map of land/water cells", "find the largest blob", or "is there a path through a maze".

Two implementation details make grid code clean in Rust. First, define the four moves once as offsets and loop over them. Second — and this is the Rust-specific gotcha — coordinates are **usize**, which *cannot be negative*. Subtracting 1 from a row of 0 does not give -1; it **wraps around** to a gigantic number (in release builds) or *panics* (in debug builds). So you must bounds-check *before* you subtract, or do the arithmetic as signed integers and convert back. Get this wrong and your flood-fill either crashes or silently reads garbage off the edge of the grid.

### Common pitfalls

- **usize underflow at the edges.** row - 1 when row is 0 wraps to usize::MAX. Always check row > 0 before subtracting, or cast to isize for the offset math and validate before indexing back.
- Forgetting to mark a cell as filled *immediately* when you enqueue it. Grids are dense with cycles (every cell connects back to its neighbours), so without a visited/recolour guard you loop forever.
- Mixing up (row, col) with (x, y). On a grid the first index is usually the row (vertical) and the second the column (horizontal); swapping them flips your whole picture.`,
      code: [
        {
          lang: 'text',
          src: `Flood-fill from the clicked cell (*), recolour the connected '.' region.
4-directional neighbours. # is a wall (different colour), stays put.

  start grid          click here (1,1)        after flood-fill
  . . # .             . . # .                 F F # .
  . * . #     ==>     the '.' blob   ==>      F F F #
  # . . .             reachable from         # F F F
  . # . .             (1,1) by up/down/      . # F F
                      left/right

neighbour offsets used each step:
        (-1, 0)
          up
  (0,-1) left  *  right (0,+1)
         down
        (+1, 0)
note: at row 0, "up" would underflow usize -> must bounds-check FIRST.`
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

// Flood-fill: recolour the region connected to (sr, sc) that shares
// its starting colour. The grid is an IMPLICIT graph of cells.
fn flood_fill(grid: &mut Vec<Vec<char>>, sr: usize, sc: usize, new: char) {
    let (rows, cols) = (grid.len(), grid[0].len());
    let target = grid[sr][sc];
    if target == new { return; }              // nothing to do

    let mut q = VecDeque::from([(sr, sc)]);
    grid[sr][sc] = new;                       // recolour ON enqueue
    while let Some((r, c)) = q.pop_front() {
        // four neighbours, with usize-safe bounds checks BEFORE subtracting
        let mut nbrs = Vec::new();
        if r > 0        { nbrs.push((r - 1, c)); }  // up: guard r > 0
        if r + 1 < rows { nbrs.push((r + 1, c)); }  // down
        if c > 0        { nbrs.push((r, c - 1)); }  // left: guard c > 0
        if c + 1 < cols { nbrs.push((r, c + 1)); }  // right
        for (nr, nc) in nbrs {
            if grid[nr][nc] == target {       // same colour => same region
                grid[nr][nc] = new;
                q.push_back((nr, nc));
            }
        }
    }
}

fn main() {
    let mut grid = vec![
        vec!['.', '.', '#'],
        vec!['.', '.', '#'],
        vec!['#', '.', '.'],
    ];
    flood_fill(&mut grid, 0, 0, 'F');
    // The connected '.' blob touching (0,0) becomes 'F'; walls '#' stay.
    assert_eq!(grid[0][0], 'F');
    assert_eq!(grid[1][1], 'F');
    assert_eq!(grid[0][2], '#');
}`
        }
      ]
    }
  ],
  takeaways: [
    'A graph is just vertices plus edges; "things and the connections between them" covers friends, roads, dependencies, prerequisites, and pixels.',
    'Directed vs undirected and weighted vs unweighted are two independent choices — for undirected adjacency lists you must push BOTH directions of every edge.',
    'Adjacency list (Vec<Vec<usize>>) is the O(n+m) default; edge list suits edge-by-edge algorithms; adjacency matrix is O(n^2), only for dense or tiny graphs.',
    'BFS uses a VecDeque (FIFO) and gives the shortest path in EDGES for unweighted graphs — mark visited on enqueue, and record distance on first sight.',
    'DFS goes deep first (recursion or an explicit Vec stack); use an explicit stack when the graph may be deep enough to overflow the call stack.',
    'Loop over every vertex and traverse from each unvisited one to count connected components and to handle disconnected graphs in general.',
    'Detect cycles with parent-tracking DFS (undirected) or the white/gray/black 3-colour DFS (directed) — only a GRAY neighbour means a real cycle.',
    'Kahn\'s algorithm topologically sorts a DAG using in-degrees; if it emits fewer than n vertices the graph had a cycle and no order exists.',
    'Union-Find answers "same group?" and merges groups in near-constant amortised time with path compression + union by rank — always union the ROOTS.',
    'A 2D grid is an implicit graph: BFS/DFS over neighbouring cells is flood-fill — and usize cannot go negative, so bounds-check before subtracting 1.'
  ],
  cheatsheet: [
    { label: 'Vec<Vec<usize>>', value: 'adjacency list; adj[u] is u\'s neighbours; O(n+m) memory' },
    { label: 'Undirected edge u-v', value: 'adj[u].push(v); adj[v].push(u); — push BOTH ways' },
    { label: 'VecDeque, push_back / pop_front', value: 'FIFO queue for BFS' },
    { label: 'Vec, push / pop', value: 'LIFO stack for iterative DFS' },
    { label: 'BFS', value: 'O(n+m); shortest path in edges, UNWEIGHTED graphs only' },
    { label: 'DFS', value: 'O(n+m); reachability, components, cycles, topo order' },
    { label: 'Count components', value: 'for v in 0..n: if unvisited, flood + count; O(n+m)' },
    { label: 'Directed cycle', value: '3-colour DFS; gray neighbour = cycle; O(n+m)' },
    { label: 'Kahn topo sort', value: 'in-degree queue; output < n means a cycle; O(n+m)' },
    { label: 'DSU find', value: 'climb to root with path compression; ~O(alpha(n))' },
    { label: 'DSU union', value: 'union by rank on the two ROOTS; ~O(alpha(n)) amortised' },
    { label: 'std::cmp::Reverse', value: 'wrap keys to turn BinaryHeap (max-heap) into a min-heap' },
    { label: 'Grid neighbours', value: '4 offsets (+-1 row/col); guard r>0 / c>0 before subtracting' },
    { label: 'usize underflow', value: '0usize - 1 wraps (release) or panics (debug); check first' }
  ]
}

export default note
