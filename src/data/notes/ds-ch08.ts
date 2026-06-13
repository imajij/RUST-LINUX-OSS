import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-08',
  track: 'dsa',
  chapter: 8,
  title: 'Tries',
  summary: `When you type the first three letters into a search box and a list of completions appears instantly, something behind the scenes is answering a very specific question: "give me every stored word that begins with these letters." A plain hash set is brilliant at "is this exact word present?" but it is hopeless at prefixes, because hashing scrambles the order of the letters and throws the prefix structure away. The **trie** (pronounced "try", from re*trie*val) is the data structure built precisely for prefix questions. It stores words by walking down a tree one character at a time, letting words that start the same way *share* the same path, so a lookup costs time proportional to the length of the word you are looking up, not the number of words you have stored.

In this chapter you will build a trie from scratch in Rust, see exactly how nodes share prefixes in memory, and implement the three core operations: insert, search for a whole word, and the star of the show, starts_with for prefix queries. You will then turn that prefix machinery into a working autocomplete, and sketch how a trie supercharges grid-based word search. Along the way we will keep coming back to the real systems that run on tries every day: search-box autocomplete, phone contact search, spell-checkers, IP routing tables doing longest-prefix match, and the old T9 keypad. By the end you will know not just how to write a trie, but exactly when a trie beats a HashSet and what you pay for that power.`,
  sections: [
    {
      heading: 'Why a HashSet is not enough: the prefix problem',
      body: `Imagine the contacts app on a phone. You have a few thousand names stored, and the moment you type "Ja" the app must show *Jacob, Jade, James, Jasmine* and nothing else, refreshing on every keystroke. The question being asked is not "do I have a contact named exactly Ja?" (you almost certainly do not), it is "which of my contacts *start with* Ja?". That is a **prefix query**, and it is a fundamentally different question from exact membership.

A **HashSet** stores items by running each one through a hash function, a process that deliberately scrambles the bytes to spread items evenly across buckets. That scrambling is exactly what makes exact lookup fast (average O(1), constant time regardless of how many items you store) but it also destroys any relationship between similar keys. "James" and "Jasmine" share the prefix "Ja", yet their hashes land in completely unrelated buckets. So to answer "which keys start with Ja" a HashSet has no choice but to walk **every single key** and test each one, which is O(n times L): n keys, each up to L characters to compare. With ten thousand contacts that is ten thousand string comparisons on every keystroke. That is the brute-force approach, and it does not scale.

A **trie** turns the problem inside out. Instead of storing whole words and hashing them, it stores words *character by character down a tree*, so words that share a prefix literally share the same path from the root. To find everything under "Ja" you walk just two steps, J then a, and everything below that point is your answer. The cost of reaching the prefix is O(L) in the length of the prefix, completely independent of how many words you stored. That is the whole pitch of the trie: **prefix queries in word-length time, not word-count time.**

### Common pitfalls

- Reaching for a HashSet out of habit when the real requirement is "find all keys with this prefix". A HashSet cannot do that efficiently; recognising the prefix requirement is the signal to switch to a trie.
- Confusing "exact lookup" with "prefix lookup". A HashSet wins the first; a trie wins the second. Know which question your feature is actually asking.`,
      code: [
        {
          lang: 'text',
          src: `EXACT MEMBERSHIP                PREFIX QUERY "Ja..."
("is James here?")              ("who starts with Ja?")

  HashSet                         Trie
  +--------+                        (root)
  | h(...) |  buckets                 |
  +--------+   scrambled              J        walk 2 steps to "Ja",
  James -> bucket 7                   |        then everything below
  Jasmine -> bucket 2                 a        is an answer.
  Jade   -> bucket 9                 /|\\
  (no order, no shared prefix)      m c d ...
                                    | | |
  prefix query = scan ALL n keys    e o e
  -> O(n * L)  SLOW                  s b   -> O(L) to prefix  FAST`
        }
      ]
    },
    {
      heading: 'The shape of a trie: nodes, edges, and shared prefixes',
      body: `A trie is a tree, but a special kind of tree. The **edges** carry the information, not the nodes. Each edge is labelled with a single character, and a word is spelled out by the sequence of edge labels you read as you walk from the root down to some node. The root itself holds no character; it is just the empty starting point, the "" before you have typed anything.

Here is the key idea that makes a trie efficient: two words that begin the same way *share their initial path*. If you store "cat" and "car", they share the edges c then a, and only split at the third character, t versus r. You never store the prefix "ca" twice; it exists once, as one path, reused by both words. This sharing is where the memory savings on overlapping words come from, and it is exactly why prefix queries are cheap, the shared structure *is* the index.

But sharing creates a puzzle. If "car" and "card" are both stored, walking c, a, r lands you on a node that is the end of "car", yet the path continues down to d for "card". How does a node know whether it marks the end of a real word or is merely a stop along the way to a longer one? The answer is a single boolean flag on every node, conventionally called **is_end** (or is_end_of_word). When you insert a word, you set is_end to true on the final node. Searching for a whole word then means "can I walk this path *and* is the final node flagged is_end?". This flag is the difference between "car is a stored word" and "ca is only a prefix on the way to cat".

So a trie node carries just two things: a way to find its children by character, and the is_end flag. Everything else, the words, the prefixes, the ordering, emerges from the tree's shape.

### Common pitfalls

- Imagining the *characters* live in the nodes. It is cleaner and more accurate to think of characters as edge labels and nodes as positions between characters. The root is the position "before any character".
- Forgetting the is_end flag and assuming "I can reach this node" means "this is a word". Without is_end, you cannot tell a complete word from a prefix of a longer word, so "ca" would falsely report as a stored word when only "cat" was inserted.`,
      code: [
        {
          lang: 'text',
          src: `Trie after inserting: "cat", "car", "card", "dog"

         (root)        * = is_end (a complete word ends here)
         /    \\
        c      d
        |      |
        a      o
       / \\     |
      t   r    g*    <- "dog"
      *   *
      |   |
      |   d          r is marked * (so "car" is a word)
      |   |          AND has a child d (so "card"
   "cat"  *          continues below r).
          |
        "card"

Notice: "cat","car","card" all SHARE the path  c -> a .
That is the prefix sharing. And because the r node is
both an end-of-word AND a step on the way to "card",
every node must carry its own is_end flag.`
        }
      ]
    },
    {
      heading: 'A trie node in Rust: HashMap children and Box',
      body: `Now we turn the picture into Rust types, and Rust's ownership rules shape the design in a way they would not in Python or Java. A node owns its children, and a tree is recursive (a node contains nodes), so we cannot write a struct that literally contains itself, that would have infinite size. We break the cycle with **Box**, a smart pointer that puts its contents on the heap and is itself just a fixed-size pointer. A child is therefore a Box of a node, and the struct has a known, finite size.

For the children themselves we have two classic choices. The first is a **HashMap<char, Box<TrieNode>>**: a map from each next character to the child node reached by that character. This is flexible (it works for any alphabet, Unicode included) and uses memory only for children that actually exist. The second choice, covered in the next section, is a fixed array. We start with the HashMap because it reads naturally and handles any character.

Add the **is_end** boolean and the node is complete. We derive **Default** so that creating a fresh, empty node is a single call to TrieNode::default(): an empty HashMap and is_end set to false. Deriving Default is idiomatic here because both fields have sensible "empty" defaults, and it saves us writing a constructor by hand. The Trie wrapper itself is just a struct holding the root node, which keeps the public API (insert, search, starts_with) separate from the recursive node internals.

One Rust-specific note that trips up newcomers: because the children map *owns* its Box children, dropping the root automatically drops the entire tree, recursively, with no manual cleanup. The same ownership system that makes self-referential structs awkward also gives you correct, leak-free teardown for free.

### Common pitfalls

- Trying to write children as a plain HashMap<char, TrieNode> without the Box. Rust rejects a struct that recursively contains itself by value because its size would be infinite; the Box (a heap pointer) is what gives the type a finite, known size.
- Forgetting derive(Default) and then writing a verbose new() that just zeroes everything. If every field is Default, derive it and call TrieNode::default().`,
      code: [
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// A node owns its children. Box puts each child on the heap so the
// struct has a finite size (a node containing nodes by value would be
// infinitely large). Default gives us an empty node for free.
#[derive(Default)]
struct TrieNode {
    children: HashMap<char, Box<TrieNode>>, // next char -> child node
    is_end: bool,                           // true if a word ENDS here
}

#[derive(Default)]
struct Trie {
    root: TrieNode, // the empty "" starting position
}

impl Trie {
    fn new() -> Self {
        Trie::default() // root is an empty TrieNode
    }
}

fn main() {
    let t = Trie::new();
    // An empty trie: root has no children and is_end is false.
    assert!(t.root.children.is_empty());
    assert!(!t.root.is_end);
    println!("empty trie ready");
}`
        }
      ]
    },
    {
      heading: 'insert: walking down and growing the tree',
      anim: 'trie-insert',
      body: `Inserting a word is a walk from the root, one character at a time, creating any node that does not yet exist along the way. For each character of the word you ask the current node: "do you have a child for this character?" If yes, step into it. If no, create a fresh empty node, attach it under that character, and step into it. After the last character you set the final node's **is_end** to true, marking "a word genuinely ends here".

In Rust the elegant way to "get the child, or create it if missing" is the **entry API** on HashMap: children.entry(ch).or_default() looks up the slot for ch and, if it is empty, inserts a Default (an empty boxed node) before handing you a mutable reference to it. This is one line that does the "look, and create on miss" in a single pass, avoiding a double lookup. We then re-borrow the current node to that child for the next iteration.

The cost is exactly O(L) in the length L of the word: one step per character, each step a single HashMap operation that is average constant time. Space added is at most O(L) too, in the worst case the word shares nothing with what is already stored and we allocate one new node per character. But here is the payoff of shared prefixes: if you insert "card" right after "car", only **one** new node (the d) is created, because c, a, r already exist and are reused. The more your words overlap, the less memory each new word costs.

Below is the trace of inserting "car" then "card" into an empty trie, frame by frame, so you can watch the tree grow and the reuse happen.

### Common pitfalls

- Forgetting to set is_end on the final node. If you only build the path but never flag the end, search will later fail to recognise the word as complete, even though every character of its path exists.
- Doing two lookups, a contains_key check followed by a get_mut, instead of one entry call. The entry API is both faster (one hash) and more idiomatic; the double-lookup pattern is a classic beginner inefficiency.`,
      code: [
        {
          lang: 'text',
          src: `TRACE  insert("car") then insert("card")   (* = is_end)

insert("car"):
 start at root
 'c': no child -> create     root -> c
 'a': no child -> create     root -> c -> a
 'r': no child -> create     root -> c -> a -> r
 end of word -> set is_end:  root -> c -> a -> r*

   (root)--c--a--r*          "car" stored

insert("card"):
 start at root
 'c': child EXISTS  -> reuse  (no new node)
 'a': child EXISTS  -> reuse  (no new node)
 'r': child EXISTS  -> reuse  (no new node)
 'd': no child -> create      one new node only!
 end of word -> set is_end

   (root)--c--a--r*--d*       "car" and "card" share c,a,r

Result: inserting a 4-letter word added just 1 node.`
        },
        {
          lang: 'rust',
          src: `impl Trie {
    fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for ch in word.chars() {
            // entry(ch).or_default(): get the child for ch, or create an
            // empty boxed node on miss. One lookup, no double search.
            node = node.children.entry(ch).or_default();
        }
        node.is_end = true; // mark that a complete word ends here
    }
}

fn main() {
    let mut t = Trie::new();
    t.insert("car");
    t.insert("card"); // reuses c, a, r; allocates only the 'd'
    t.insert("cat");
    // c,a path is shared by car/card/cat; only the tails differ.
    println!("inserted car, card, cat");
}`
        }
      ]
    },
    {
      heading: 'search and starts_with: the two questions a trie answers',
      body: `Both lookups are the same walk, and they differ only in what they check at the end. To **search** for a whole word, walk the path character by character; if at any point the next character has no child, the word is absent, return false immediately. If you reach the end of the word, return the final node's **is_end** flag, true only if a word genuinely ends there. To answer **starts_with** (the prefix query), do the identical walk, but at the end simply return true if you arrived, *ignoring* is_end entirely, because reaching the node proves the prefix exists, whether or not a complete word ends on it.

That single difference is the entire reason a trie exists. "car" and "ca": searching for "ca" returns false (no word ends on the a node), but starts_with("ca") returns true (the path exists because "car" lives below it). A HashSet collapses both into "is this exact key present" and so cannot tell them apart; a trie keeps the path, so it answers both.

Both operations are **O(L)** time, L the length of the query string, and **O(1)** extra space (we hold just a single moving reference, no recursion stack needed for the iterative version). That O(L) bound is the headline: it does not contain n, the number of stored words, at all. A trie with ten words and a trie with ten million words answer starts_with("ja") in the same handful of steps. This is precisely the property an autocomplete needs, and precisely the property a HashSet cannot offer.

We factor out the shared walk into a private helper that returns the node at the end of a path (or None if the path breaks), then write search and starts_with as one-liners on top of it, classic don't-repeat-yourself.

### Common pitfalls

- Returning true from search just because the walk completed. You must also check is_end; otherwise every prefix of a stored word falsely reports as a stored word.
- Conversely, checking is_end inside starts_with. A prefix query must NOT require a word to end on the node; reaching the node is the whole answer.
- Using usize arithmetic to index into the word and decrementing past zero. Walk with chars() instead; usize cannot go negative and an underflow panics. Iterating characters sidesteps index math entirely.`,
      code: [
        {
          lang: 'text',
          src: `Trie stores: "car", "card"        search vs starts_with

   (root)--c--a--r*--d*

search("car"):     walk c,a,r -> on r, is_end? YES -> true
search("ca"):      walk c,a   -> on a, is_end? NO  -> false
search("care"):    walk c,a,r -> need 'e', no child -> false
starts_with("ca"): walk c,a   -> arrived (ignore is_end) -> true
starts_with("cb"): walk c     -> need 'b', no child -> false

Same walk. search checks is_end at the end;
starts_with just checks that the walk arrived.`
        },
        {
          lang: 'rust',
          src: `impl Trie {
    // Shared walk: follow the path, return the node reached or None.
    fn walk(&self, s: &str) -> Option<&TrieNode> {
        let mut node = &self.root;
        for ch in s.chars() {
            // get the child for ch; if absent, the path breaks.
            node = node.children.get(&ch)?; // ? returns None on a miss
        }
        Some(node)
    }

    // Whole-word search: path must exist AND a word must end here.
    fn search(&self, word: &str) -> bool {
        self.walk(word).map_or(false, |n| n.is_end)
    }

    // Prefix query: path must exist; is_end is irrelevant.
    fn starts_with(&self, prefix: &str) -> bool {
        self.walk(prefix).is_some()
    }
}

fn main() {
    let mut t = Trie::new();
    t.insert("car");
    t.insert("card");
    assert!(t.search("car"));          // word ends on r
    assert!(!t.search("ca"));          // "ca" is only a prefix
    assert!(t.starts_with("ca"));      // but the prefix exists
    assert!(!t.starts_with("cb"));     // no such path
    println!("all trie queries correct");
}`
        }
      ]
    },
    {
      heading: 'Autocomplete: walk to the prefix, then DFS to collect words',
      body: `Now we build the feature that motivated everything: type a prefix, get back every stored word that begins with it. The algorithm is two clean phases that mirror exactly how the trie is built to be used. **Phase one:** walk from the root to the node at the end of the prefix, the same O(L) walk as starts_with. If the walk breaks, there are no completions, return an empty list. **Phase two:** from that prefix node, explore the *entire subtree* below it and collect every node flagged is_end, reconstructing each word by remembering the characters on the path you took to reach it. Exploring an entire subtree is a **depth-first search (DFS)**: go as deep as you can down one branch, recording characters, and back up when you hit a dead end, trying the next branch.

Picture autocomplete for "ca" in a trie holding *car, card, cat, dog*. Phase one walks c then a to land on the "ca" node. Phase two does a DFS from there and emerges with *car, card, cat*, the dog branch is a sibling of c, never visited, because we started below "ca". The cost is O(L) to reach the prefix plus O(size of the subtree) to enumerate the answers, which is optimal: you cannot list k completions in less than time proportional to k.

In Rust the DFS carries a String buffer that we push a character onto before descending and pop after returning, so the buffer always spells the current path. We start that buffer with the prefix itself so each collected word comes out whole. One subtle but important detail: HashMap iteration order is unspecified, so the completions come back unordered; if you need them alphabetical (as a real search box does) you sort the children or the final list. We sort the result for predictable output.

### Common pitfalls

- Forgetting to push the prefix into the buffer before the DFS, so you collect only the *suffixes* ("r", "rd", "t") instead of the full words ("car", "card", "cat").
- Forgetting to pop the character after recursing (or relying on it via a fresh clone each call). If you push without popping on a shared buffer, sibling branches inherit each other's characters and you get garbage words.
- Expecting alphabetical order from a HashMap-backed trie. Iteration order is unspecified; sort explicitly if order matters, or use a BTreeMap for children to get sorted traversal automatically.`,
      code: [
        {
          lang: 'text',
          src: `autocomplete("ca")  on  {car, card, cat, dog}

PHASE 1: walk to prefix node       PHASE 2: DFS below it, collect is_end

   (root)                           start buffer = "ca", at node (ca)
    / \\                              |
   c   d   <- 'd' branch ignored      r* -> emit "car"
   |        (it's a sibling of c)     |
   a  <==== prefix node "ca"          d* -> emit "card"
  / \\                                 back up...
 r   t                                t* -> emit "cat"

                                     collected = [car, card, cat]
                                     (dog never visited: wrong branch)`
        },
        {
          lang: 'rust',
          src: `impl Trie {
    // Return every stored word beginning with prefix.
    fn autocomplete(&self, prefix: &str) -> Vec<String> {
        let mut out = Vec::new();
        // Phase 1: walk to the prefix node (reuse our helper).
        let Some(node) = self.walk(prefix) else {
            return out; // prefix not present -> no completions
        };
        // Phase 2: DFS the subtree, building words from the prefix.
        let mut buf = String::from(prefix);
        Self::collect(node, &mut buf, &mut out);
        out.sort(); // HashMap order is unspecified; sort for the UI
        out
    }

    fn collect(node: &TrieNode, buf: &mut String, out: &mut Vec<String>) {
        if node.is_end {
            out.push(buf.clone()); // a complete word ends here
        }
        for (&ch, child) in &node.children {
            buf.push(ch);              // extend the path
            Self::collect(child, buf, out);
            buf.pop();                 // backtrack: undo this char
        }
    }
}

fn main() {
    let mut t = Trie::new();
    for w in ["car", "card", "cat", "dog"] { t.insert(w); }
    assert_eq!(t.autocomplete("ca"), vec!["car", "card", "cat"]);
    assert_eq!(t.autocomplete("do"), vec!["dog"]);
    assert!(t.autocomplete("xyz").is_empty());
    println!("autocomplete works");
}`
        }
      ]
    },
    {
      heading: 'The array variant, and a word-search-on-a-board sketch',
      body: `When you know the alphabet is small and fixed, say the 26 lowercase English letters, you can replace the HashMap with a **fixed array [Option<Box<TrieNode>>; 26]**, indexing it by (letter as byte minus the byte value of 'a'). Each slot is None until a child exists. This removes hashing entirely: following an edge becomes a plain array index, which is faster and more cache-friendly than a hash lookup. The trade-off is space: every node carries 26 slots whether or not it uses them, so a sparse trie wastes memory. Choose the array when the alphabet is small and dense, the HashMap when it is large, sparse, or Unicode. Note one Rust quirk: an array of 26 Options of Box must be built carefully because Option<Box<T>> is not Copy, so you use Default::default() to get an array of all None rather than the [x; 26] copy syntax.

The trie's second classic use is **word search on a board**: given a grid of letters and a dictionary, find every dictionary word that can be traced through adjacent cells. The brute force is to run a separate search for each dictionary word, paying O(words times board) and re-walking shared prefixes over and over. The trie collapses that: build one trie of the whole dictionary, then do a single DFS over the board where, at each cell, you descend *the trie in lockstep with the path on the board*. The instant the current path is not a prefix in the trie (the trie has no child for that letter) you prune the entire branch immediately, never exploring letters that cannot lead to any word. Words that share prefixes are checked together, once, instead of independently. The trie acts as a built-in "can this path possibly become a word?" oracle that turns a hopeless brute force into a fast pruned search.

### Common pitfalls

- Building the array with [None; 26]. That requires Copy, and Option<Box<TrieNode>> is not Copy. Use std::array::from_fn(|_| None) or Default to construct an array of all None.
- In board search, forgetting to mark a cell visited before recursing (and unmark after), so the search reuses the same cell within one word. Track a visited grid or temporarily overwrite the cell, then restore it on backtrack.
- Mapping letters to indices with signed arithmetic. The expression letter as usize minus 'a' as usize must stay non-negative; on non-lowercase input it underflows and panics, since usize cannot go negative. Validate or constrain the alphabet first.`,
      code: [
        {
          lang: 'text',
          src: `ARRAY NODE (26 lowercase letters)   index = letter - 'a'

  children: [Option<Box<TrieNode>>; 26]
  +----+----+----+-- ... --+----+
  |  a |  b |  c |  ...     |  z |
  +----+----+----+--   ---+-+----+
   None None   |           None     slot 'c' (index 2)
               v                    holds Box(child);
        Box(child node)             every other slot None.

  no hashing: following an edge = one plain array index.

WORD SEARCH pruning with a trie:
  board path  C -> A -> X
  trie:       c -> a -> (no 'x' child)  ==> PRUNE here,
              stop exploring this branch entirely.
  One DFS over the board checks ALL dictionary words at once.`
        },
        {
          lang: 'rust',
          src: `// Array-backed node for a fixed 26-letter alphabet.
struct ArrayNode {
    children: [Option<Box<ArrayNode>>; 26],
    is_end: bool,
}

impl ArrayNode {
    fn new() -> Self {
        // Option<Box<_>> is NOT Copy, so [None; 26] is illegal.
        // from_fn builds each slot independently as None.
        ArrayNode { children: std::array::from_fn(|_| None), is_end: false }
    }

    fn insert(&mut self, word: &str) {
        let mut node = self;
        for b in word.bytes() {
            let i = (b - b'a') as usize; // map 'a'..'z' to 0..25
            node = node.children[i].get_or_insert_with(|| Box::new(ArrayNode::new()));
        }
        node.is_end = true;
    }

    // child_for is the lockstep step a board search uses to prune:
    // returns None the moment the path stops being a valid prefix.
    fn child_for(&self, b: u8) -> Option<&ArrayNode> {
        self.children[(b - b'a') as usize].as_deref()
    }
}

fn main() {
    let mut n = ArrayNode::new();
    n.insert("cat");
    assert!(n.child_for(b'c').is_some());
    assert!(n.child_for(b'z').is_none()); // prune: no word starts c..z..
    println!("array trie ready for board search");
}`
        }
      ]
    },
    {
      heading: 'Costs, trade-offs, and when a trie wins',
      body: `Let us state the costs plainly. For a trie over an alphabet of size A, **insert**, **search**, and **starts_with** are all **O(L)** time, where L is the length of the query word, and crucially independent of n, the number of words stored. With a HashMap child map each step is average O(1); with the array child map each step is exactly O(1) with no hashing. **Autocomplete** is O(L) to reach the prefix plus O(k) to emit the k completions, which is optimal. Compare this to a HashSet: exact search is O(L) to hash plus compare, comparable to the trie, but a *prefix* query forces a full O(n times L) scan of every key. That is the gap the trie closes.

The price you pay is **memory**. A trie allocates a node per distinct character position, and with a HashMap (or 26-slot array) per node, the per-node overhead is real. For a set of words with little shared prefix structure, a trie can use noticeably more memory than a compact HashSet of strings. The trie pays off when (a) words share many prefixes, so nodes are reused, and (b) you actually need prefix operations, autocomplete, longest-prefix match, ordered traversal, that a hash set cannot provide at all. If all you ever do is exact membership, a HashSet is smaller and simpler; reach for a trie when prefixes are the point.

This trade-off is exactly why tries run the systems we opened with. **Search-box autocomplete** and **phone contact search** are prefix queries by definition. A **spell-checker** walks the trie to test membership and explores nearby branches to suggest corrections. An **IP routing table** does *longest-prefix match*, find the most specific stored prefix of an address, which is a trie walk that remembers the deepest is_end seen; a hash table simply cannot express "longest matching prefix". And **T9** texting mapped digit sequences to a trie of words to predict what you were typing on a 9-key pad. In every case the structure of the keys, their prefixes, *is* the query, and the trie is the structure built to exploit it.

### Common pitfalls

- Choosing a trie for plain exact-membership workloads. With no prefix queries and little prefix sharing, a HashSet is smaller and just as fast for lookup; the trie's memory overhead buys you nothing.
- Underestimating per-node memory. Thousands of nearly unique words can blow up node count; consider a compressed/radix trie (which merges single-child chains into one edge) when memory matters.
- Assuming a trie gives sorted output automatically. It does only if children are stored in an ordered map (like BTreeMap) or you sort; a HashMap-backed trie yields arbitrary order.`,
      code: [
        {
          lang: 'text',
          src: `           exact     prefix query     ordered   memory
           -----     ------------     -------   ------
HashSet    O(L)      O(n*L)  SLOW     no        compact
Trie       O(L)      O(L) +O(k)       yes if    bigger:
                     to list k        sorted    1 node/char

(L = word length, n = words stored, k = matches listed.
 The trie's prefix cost has NO n in it; that is the win.)

LONGEST-PREFIX MATCH (IP routing), trie remembers deepest is_end:

  address bits: 1 1 0 1 ...
  walk:  1 -> 1 -> 0 -> 1
         *         *            <- two stored prefixes matched
                   ^ deepest match wins (most specific route)

  A hash table cannot answer "longest stored prefix of X";
  the trie does it in one O(L) walk.`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashSet;

fn main() {
    // The crossover: BOTH can do exact membership...
    let mut set = HashSet::new();
    set.insert("car"); set.insert("card"); set.insert("cat");
    assert!(set.contains("car"));          // O(L), great

    // ...but only the trie answers a PREFIX query cheaply.
    // HashSet must scan every key:
    let prefix = "ca";
    let any_with_prefix = set.iter().any(|w| w.starts_with(prefix)); // O(n*L)
    assert!(any_with_prefix);

    // A trie does the same in O(L) AND can list all matches in order.
    let mut t = Trie::new();
    for w in ["car", "card", "cat"] { t.insert(w); }
    assert!(t.starts_with("ca"));          // O(L), no scan
    assert_eq!(t.autocomplete("ca"), vec!["car", "card", "cat"]);
    println!("trie wins when prefixes are the question");
}`
        }
      ]
    }
  ],
  takeaways: [
    'A trie stores words character by character down a tree, so words with a common prefix share one path; lookups cost O(L) in word length, never O(n) in word count.',
    'A HashSet excels at exact membership but cannot answer prefix queries without scanning all n keys; that is the gap a trie fills.',
    'Characters live on the edges; nodes are positions between characters, and the root is the empty "" start.',
    'Every node needs an is_end flag to distinguish a complete word from a mere prefix of a longer one (car vs ca on the way to cat).',
    'In Rust, children are HashMap<char, Box<TrieNode>> (or a fixed [Option<Box<TrieNode>>; 26]); Box gives the recursive struct a finite size and derive(Default) makes empty nodes free.',
    'insert walks and creates missing nodes with entry(ch).or_default(), then sets is_end; search and starts_with are the same walk differing only in whether they check is_end at the end.',
    'Autocomplete is two phases: O(L) walk to the prefix node, then a DFS of its subtree collecting is_end nodes, rebuilding words from the path (remember to pop on backtrack).',
    'The array node variant trades memory (26 slots per node) for hash-free O(1) edge steps; build it with array::from_fn since Option<Box<T>> is not Copy.',
    'A trie supercharges board word search by walking the dictionary trie in lockstep with the board path and pruning the instant a path is no longer a valid prefix.',
    'Tries cost more memory than a hash set but win whenever prefixes are the query: autocomplete, contact search, spell-check, IP longest-prefix match, and T9.'
  ],
  cheatsheet: [
    { label: 'TrieNode fields', value: 'children: HashMap<char, Box<TrieNode>>, is_end: bool' },
    { label: 'derive(Default)', value: 'empty node = TrieNode::default(); no hand-written new needed' },
    { label: 'Box<TrieNode>', value: 'heap pointer that gives the recursive struct a finite size' },
    { label: 'insert', value: 'entry(ch).or_default() per char, then set is_end; O(L) time' },
    { label: 'search(word)', value: 'walk path, return final node.is_end; O(L) time, O(1) space' },
    { label: 'starts_with(p)', value: 'walk path, return arrived (ignore is_end); O(L) time' },
    { label: 'autocomplete(p)', value: 'walk to prefix O(L) + DFS subtree O(k) to list k words' },
    { label: 'children.get(&ch)?', value: 'follow an edge; ? returns None when the path breaks' },
    { label: 'or_default()', value: 'one-lookup get-or-create child (vs contains_key + get_mut)' },
    { label: 'array node', value: '[Option<Box<TrieNode>>; 26], index = letter - b\'a\'' },
    { label: 'array::from_fn(|_| None)', value: 'build all-None array; Option<Box<T>> is not Copy' },
    { label: 'Trie vs HashSet', value: 'same O(L) exact lookup; trie alone does O(L) prefix queries' },
    { label: 'HashSet prefix scan', value: 'O(n * L) full scan; the cost a trie avoids' },
    { label: 'longest-prefix match', value: 'trie walk tracking deepest is_end; IP routing, T9' }
  ]
}

export default note
