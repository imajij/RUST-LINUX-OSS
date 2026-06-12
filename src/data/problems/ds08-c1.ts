import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch08-c-001',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Insert, Search, and StartsWith',
    prompt: `Implement a Trie struct supporting three operations:

    fn insert(&mut self, word: &str)
    fn search(&self, word: &str) -> bool        // true only if exact word was inserted
    fn starts_with(&self, prefix: &str) -> bool // true if any inserted word begins with prefix

Words contain lowercase letters only. Example: after inserting "app", "apple", "application":
search("app") -> true, search("ap") -> false, starts_with("ap") -> true, starts_with("xyz") -> false.`,
    hints: [
      'Each node holds a HashMap<char, TrieNode> for children and a bool end flag.',
      'search requires the end flag to be true at the last character node; starts_with only needs the node to exist.',
    ],
    solution: `use std::collections::HashMap;

#[derive(Default)]
struct Trie { children: HashMap<char, Trie>, end: bool }

impl Trie {
    fn new() -> Self { Trie::default() }
    fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
    }
    fn find(&self, s: &str) -> Option<&Trie> {
        let mut node = self;
        for c in s.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return None,
            }
        }
        Some(node)
    }
    fn search(&self, word: &str) -> bool { self.find(word).map_or(false, |n| n.end) }
    fn starts_with(&self, prefix: &str) -> bool { self.find(prefix).is_some() }
}

fn main() {
    let mut t = Trie::new();
    t.insert("app");
    t.insert("apple");
    t.insert("application");
    assert!(t.search("app"));
    assert!(t.search("apple"));
    assert!(!t.search("ap"));
    assert!(t.starts_with("ap"));
    assert!(t.starts_with("appl"));
    assert!(!t.starts_with("xyz"));
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

#[derive(Default)]
struct Trie { children: HashMap<char, Trie>, end: bool }

impl Trie {
    fn new() -> Self { Trie::default() }
    fn insert(&mut self, word: &str) { let _ = word; todo!() }
    fn search(&self, word: &str) -> bool { let _ = word; todo!() }
    fn starts_with(&self, prefix: &str) -> bool { let _ = prefix; todo!() }
}

fn main() {
    let mut t = Trie::new();
    t.insert("app");
    assert!(t.search("app"));
    println!("ok");
}`,
    tags: ['trie', 'string', 'hash-map'],
  },
  {
    id: 'ds-ch08-c-002',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Words Equal To and With Prefix',
    prompt: `Extend a Trie to track insertion counts. Implement:

    fn insert(&mut self, word: &str)
    fn count_words_equal_to(&self, word: &str) -> usize   // how many times word was inserted
    fn count_words_starting_with(&self, prefix: &str) -> usize // total insertions that share this prefix

Example: insert "app", "app", "apple", "application", "apply".
count_words_equal_to("app") -> 2, count_words_starting_with("app") -> 5, count_words_starting_with("xyz") -> 0.`,
    hints: [
      'Store a count field at each node representing how many complete words pass through or end here.',
      'count_words_starting_with sums all end-node counts in the subtree below the prefix node.',
    ],
    solution: `use std::collections::HashMap;

#[derive(Default)]
struct Trie { children: HashMap<char, Trie>, end: bool, count: usize }

impl Trie {
    fn new() -> Self { Trie::default() }
    fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
        node.count += 1;
    }
    fn count_words_equal_to(&self, word: &str) -> usize {
        let mut node = self;
        for c in word.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return 0,
            }
        }
        if node.end { node.count } else { 0 }
    }
    fn count_words_starting_with(&self, prefix: &str) -> usize {
        let mut node = self;
        for c in prefix.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return 0,
            }
        }
        Self::count_all(node)
    }
    fn count_all(node: &Trie) -> usize {
        let mut total = if node.end { node.count } else { 0 };
        for child in node.children.values() {
            total += Self::count_all(child);
        }
        total
    }
}

fn main() {
    let mut t = Trie::new();
    let words = ["apple", "app", "app", "application", "apply"];
    for w in &words { t.insert(w); }
    assert_eq!(t.count_words_equal_to("app"), 2);
    assert_eq!(t.count_words_equal_to("apple"), 1);
    assert_eq!(t.count_words_equal_to("xyz"), 0);
    assert_eq!(t.count_words_starting_with("app"), 5);
    assert_eq!(t.count_words_starting_with("appl"), 3);
    assert_eq!(t.count_words_starting_with("xyz"), 0);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

#[derive(Default)]
struct Trie { children: HashMap<char, Trie>, end: bool, count: usize }

impl Trie {
    fn new() -> Self { Trie::default() }
    fn insert(&mut self, word: &str) { let _ = word; todo!() }
    fn count_words_equal_to(&self, word: &str) -> usize { let _ = word; todo!() }
    fn count_words_starting_with(&self, prefix: &str) -> usize { let _ = prefix; todo!() }
}

fn main() {
    let mut t = Trie::new();
    t.insert("app");
    t.insert("app");
    assert_eq!(t.count_words_equal_to("app"), 2);
    println!("ok");
}`,
    tags: ['trie', 'counting', 'string'],
  },
  {
    id: 'ds-ch08-c-003',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Delete a Word from a Trie',
    prompt: `Implement a Trie that supports inserting, searching, and deleting words:

    fn insert(&mut self, word: &str)
    fn search(&self, word: &str) -> bool
    fn delete(&mut self, word: &str) -> bool  // returns false if word not present

After deleting a word, search should return false for that word. If one word is a prefix of another,
deleting the longer one must not affect the shorter one. Example: insert "apple" and "app";
delete "apple" -> search("apple") returns false, search("app") still returns true.`,
    hints: [
      'Use a recursive helper that returns true when a child node can be removed entirely.',
      'Only remove a child when its subtree is empty and it is not itself an end node.',
    ],
    solution: `use std::collections::HashMap;

#[derive(Default)]
struct Trie { children: HashMap<char, Trie>, end: bool }

impl Trie {
    fn new() -> Self { Trie::default() }
    fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
    }
    fn delete(&mut self, word: &str) -> bool {
        Self::delete_helper(self, word, 0)
    }
    fn delete_helper(node: &mut Trie, word: &str, depth: usize) -> bool {
        let chars: Vec<char> = word.chars().collect();
        if depth == chars.len() {
            if !node.end { return false; }
            node.end = false;
            return node.children.is_empty();
        }
        let c = chars[depth];
        if !node.children.contains_key(&c) { return false; }
        let should_delete = Self::delete_helper(node.children.get_mut(&c).unwrap(), word, depth + 1);
        if should_delete {
            node.children.remove(&c);
            return !node.end && node.children.is_empty();
        }
        false
    }
    fn search(&self, word: &str) -> bool {
        let mut node = self;
        for c in word.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return false,
            }
        }
        node.end
    }
}

fn main() {
    let mut t = Trie::new();
    t.insert("apple");
    t.insert("app");
    assert!(t.search("apple"));
    assert!(t.search("app"));
    t.delete("apple");
    assert!(!t.search("apple"));
    assert!(t.search("app"));
    t.delete("app");
    assert!(!t.search("app"));
    t.insert("hello");
    assert!(t.search("hello"));
    t.delete("hello");
    assert!(!t.search("hello"));
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

#[derive(Default)]
struct Trie { children: HashMap<char, Trie>, end: bool }

impl Trie {
    fn new() -> Self { Trie::default() }
    fn insert(&mut self, word: &str) { let _ = word; todo!() }
    fn search(&self, word: &str) -> bool { let _ = word; todo!() }
    fn delete(&mut self, word: &str) -> bool { let _ = word; todo!() }
}

fn main() {
    let mut t = Trie::new();
    t.insert("apple");
    assert!(t.search("apple"));
    t.delete("apple");
    assert!(!t.search("apple"));
    println!("ok");
}`,
    tags: ['trie', 'delete', 'recursion'],
  },
  {
    id: 'ds-ch08-c-004',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Longest Common Prefix via Trie',
    prompt: `Given a list of words, find their longest common prefix using a Trie. Build the trie from
all words, then walk from the root as long as each node has exactly one child and is not itself
a word-end node. The depth reached is the length of the longest common prefix.

Example: ["flower","flow","flight"] -> "fl", ["dog","racecar","car"] -> "", ["abc"] -> "abc".
Return an empty string if there is no common prefix.`,
    hints: [
      'Insert all words into a trie first.',
      'Walk from the root: stop when a node has more than one child or is marked as a complete word.',
    ],
    solution: `fn lcp_brute(words: &[&str]) -> String {
    if words.is_empty() { return String::new(); }
    let first: Vec<char> = words[0].chars().collect();
    let mut len = first.len();
    for w in words.iter().skip(1) {
        let wc: Vec<char> = w.chars().collect();
        let common = first.iter().zip(wc.iter()).take_while(|(a,b)| a == b).count();
        len = len.min(common);
    }
    first[..len].iter().collect()
}

fn longest_common_prefix_trie(words: &[&str]) -> String {
    use std::collections::HashMap;
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    if words.is_empty() { return String::new(); }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
    }
    let mut prefix = String::new();
    let mut node = &root;
    for c in words[0].chars() {
        if node.children.len() == 1 && !node.end {
            if let Some(child) = node.children.get(&c) {
                prefix.push(c);
                node = child;
            } else { break; }
        } else { break; }
    }
    prefix
}

fn main() {
    let cases: &[&[&str]] = &[
        &["flower","flow","flight"],
        &["dog","racecar","car"],
        &["interview","interact","interface"],
        &["abc"],
        &["same","same","same"],
    ];
    for &words in cases {
        let expected = lcp_brute(words);
        let got = longest_common_prefix_trie(words);
        assert_eq!(got, expected, "words={:?}", words);
    }
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

#[derive(Default)]
struct Node { children: HashMap<char, Node>, end: bool }

fn longest_common_prefix_trie(words: &[&str]) -> String {
    // TODO: build a trie, then walk until a branch or word-end
    let _ = words;
    todo!()
}

fn main() {
    let words = &["flower","flow","flight"];
    assert_eq!(longest_common_prefix_trie(words), "fl");
    println!("ok");
}`,
    tags: ['trie', 'string', 'prefix'],
  },
  {
    id: 'ds-ch08-c-005',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Replace Words with Shortest Root',
    prompt: `Given a list of root words and a sentence, replace every word in the sentence with the shortest
matching root from the list. A root matches a word if the word starts with that root. If multiple
roots match, use the shortest one.

    fn replace_words(sentence: &str, roots: &[&str]) -> String

Example: roots = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
-> "the cat was rat by the bat".`,
    hints: [
      'Insert all roots into a trie. For each word in the sentence, walk the trie and stop at the first end node.',
      'The first end node encountered along the path gives the shortest matching root.',
    ],
    solution: `use std::collections::HashMap;

fn replace_words(sentence: &str, roots: &[&str]) -> String {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &r in roots {
        let mut node = &mut root;
        for c in r.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
    }
    fn find_root<'a>(trie: &Node, word: &'a str) -> &'a str {
        let mut node = trie;
        for (i, c) in word.char_indices() {
            if node.end { return &word[..i]; }
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return word,
            }
        }
        if node.end { word } else { word }
    }
    sentence.split_whitespace()
        .map(|w| find_root(&root, w).to_string())
        .collect::<Vec<_>>()
        .join(" ")
}

fn main() {
    let roots = &["cat","bat","rat"];
    let sentence = "the cattle was rattled by the battery";
    let result = replace_words(sentence, roots);
    assert_eq!(result, "the cat was rat by the bat");

    let roots2 = &["a","b","c"];
    let s2 = "aardvark bobcat catfish";
    let r2 = replace_words(s2, roots2);
    assert_eq!(r2, "a b c");

    let roots3 = &["xyz"];
    let s3 = "hello world";
    let r3 = replace_words(s3, roots3);
    assert_eq!(r3, "hello world");

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn replace_words(sentence: &str, roots: &[&str]) -> String {
    // TODO: build trie from roots, then replace each sentence word
    let _ = (sentence, roots);
    todo!()
}

fn main() {
    let roots = &["cat","bat","rat"];
    let s = "the cattle was rattled by the battery";
    assert_eq!(replace_words(s, roots), "the cat was rat by the bat");
    println!("ok");
}`,
    tags: ['trie', 'string', 'greedy'],
  },
  {
    id: 'ds-ch08-c-006',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Longest Word Built One Character at a Time',
    prompt: `Given a list of words, find the longest word that can be built character by character, where
each prefix of length 1, 2, ... k-1 also appears in the list. If there is a tie in length,
return the lexicographically smallest one.

    fn longest_word(words: &[&str]) -> String

Example: ["a","banana","app","appl","ap","apply","apple"] -> "apple"
(all prefixes a, ap, app, appl are in the list).`,
    hints: [
      'Insert all words. Do a DFS from the root, only descending into nodes whose end flag is set.',
      'Track the current word string and update the best result when a longer (or lex-smaller equal-length) word is found.',
    ],
    solution: `use std::collections::HashMap;

fn longest_word_built_char_by_char(words: &[&str]) -> String {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
    }
    fn dfs(node: &Node, current: &mut String, best: &mut String) {
        if current.len() > best.len() || (current.len() == best.len() && current < best) {
            *best = current.clone();
        }
        let mut children: Vec<(char, &Node)> = node.children.iter()
            .filter(|(_, n)| n.end)
            .map(|(&c, n)| (c, n))
            .collect();
        children.sort_by_key(|(c, _)| *c);
        for (c, child) in children {
            current.push(c);
            dfs(child, current, best);
            current.pop();
        }
    }
    let mut current = String::new();
    let mut best = String::new();
    dfs(&root, &mut current, &mut best);
    best
}

fn brute_longest_word(words: &[&str]) -> String {
    use std::collections::HashSet;
    let set: HashSet<&str> = words.iter().cloned().collect();
    let mut result = "";
    for &w in words {
        let all_prefixes = (1..w.len()).all(|i| set.contains(&w[..i]));
        if all_prefixes {
            if w.len() > result.len() || (w.len() == result.len() && w < result) {
                result = w;
            }
        }
    }
    result.to_string()
}

fn main() {
    let tests: &[&[&str]] = &[
        &["w","wo","wor","worl","world"],
        &["a","banana","app","appl","ap","apply","apple"],
        &["ab","abc","abcd","abcde","b","bc"],
    ];
    for &words in tests {
        let got = longest_word_built_char_by_char(words);
        let expected = brute_longest_word(words);
        assert_eq!(got, expected, "words={:?}", words);
    }
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn longest_word(words: &[&str]) -> String {
    // TODO: insert all words, then DFS only through nodes marked as word-ends
    let _ = words;
    todo!()
}

fn main() {
    let words = &["w","wo","wor","worl","world"];
    assert_eq!(longest_word(words), "world");
    println!("ok");
}`,
    tags: ['trie', 'dfs', 'string'],
  },
  {
    id: 'ds-ch08-c-007',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Map Sum Pairs',
    prompt: `Design a data structure that maps string keys to integer values and can sum values by prefix:

    fn insert(&mut self, key: &str, val: i32)   // insert or overwrite key with val
    fn sum(&self, prefix: &str) -> i32          // sum of all values whose key starts with prefix

Example: insert("apple", 3), sum("ap") -> 3. Then insert("app", 2), sum("ap") -> 5.
Inserting the same key again overwrites its value.`,
    hints: [
      'Store the integer value at the end node of each key.',
      'sum recursively totals all val fields in the subtree rooted at the end of the prefix path.',
    ],
    solution: `use std::collections::HashMap;

#[derive(Default)]
struct MapSumTrie { children: HashMap<char, MapSumTrie>, val: i32 }

impl MapSumTrie {
    fn new() -> Self { MapSumTrie::default() }
    fn insert(&mut self, key: &str, val: i32) {
        let mut node = self;
        for c in key.chars() {
            node = node.children.entry(c).or_default();
        }
        node.val = val;
    }
    fn sum(&self, prefix: &str) -> i32 {
        let mut node = self;
        for c in prefix.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return 0,
            }
        }
        Self::sum_all(node)
    }
    fn sum_all(node: &MapSumTrie) -> i32 {
        let mut total = node.val;
        for child in node.children.values() {
            total += Self::sum_all(child);
        }
        total
    }
}

fn main() {
    let mut ms = MapSumTrie::new();
    ms.insert("apple", 3);
    assert_eq!(ms.sum("ap"), 3);
    ms.insert("app", 2);
    assert_eq!(ms.sum("ap"), 5);
    ms.insert("banana", 10);
    assert_eq!(ms.sum("b"), 10);
    assert_eq!(ms.sum("ap"), 5);
    assert_eq!(ms.sum("xyz"), 0);
    ms.insert("apple", 7);
    assert_eq!(ms.sum("ap"), 9);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

#[derive(Default)]
struct MapSumTrie { children: HashMap<char, MapSumTrie>, val: i32 }

impl MapSumTrie {
    fn new() -> Self { MapSumTrie::default() }
    fn insert(&mut self, key: &str, val: i32) { let _ = (key, val); todo!() }
    fn sum(&self, prefix: &str) -> i32 { let _ = prefix; todo!() }
}

fn main() {
    let mut ms = MapSumTrie::new();
    ms.insert("apple", 3);
    assert_eq!(ms.sum("ap"), 3);
    println!("ok");
}`,
    tags: ['trie', 'hash-map', 'prefix-sum'],
  },
  {
    id: 'ds-ch08-c-008',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Autocomplete All Words with a Prefix',
    prompt: `Given a list of words and a prefix string, return all words from the list that begin with
that prefix, sorted in lexicographic order.

    fn autocomplete(words: &[&str], prefix: &str) -> Vec<String>

Example: words = ["apple","app","application","banana","band","bandana","apt"], prefix = "app"
-> ["app","apple","application"] (sorted). If no word matches, return an empty vector.`,
    hints: [
      'Build a trie from all words. Navigate to the end of the prefix path.',
      'From that node, do a DFS collecting all complete words (nodes with end=true) in sorted order.',
    ],
    solution: `use std::collections::HashMap;

fn autocomplete(words: &[&str], prefix: &str) -> Vec<String> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    fn insert(root: &mut Node, word: &str) {
        let mut node = root;
        for c in word.chars() { node = node.children.entry(c).or_default(); }
        node.end = true;
    }
    fn collect_words(node: &Node, current: &mut String, results: &mut Vec<String>) {
        if node.end { results.push(current.clone()); }
        let mut keys: Vec<char> = node.children.keys().cloned().collect();
        keys.sort();
        for c in keys {
            current.push(c);
            collect_words(node.children.get(&c).unwrap(), current, results);
            current.pop();
        }
    }
    let mut root = Node::default();
    for &w in words { insert(&mut root, w); }
    let mut node = &root;
    for c in prefix.chars() {
        match node.children.get(&c) {
            Some(n) => node = n,
            None => return vec![],
        }
    }
    let mut results = Vec::new();
    let mut current = prefix.to_string();
    collect_words(node, &mut current, &mut results);
    results
}

fn main() {
    let words = &["apple","app","application","banana","band","bandana","apt"];
    let mut r = autocomplete(words, "app");
    r.sort();
    assert_eq!(r, vec!["app","apple","application"]);

    let r2 = autocomplete(words, "ban");
    assert_eq!(r2, vec!["banana","band","bandana"]);

    let r3 = autocomplete(words, "xyz");
    assert!(r3.is_empty());

    let r4 = autocomplete(words, "ap");
    assert_eq!(r4, vec!["app","apple","application","apt"]);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn autocomplete(words: &[&str], prefix: &str) -> Vec<String> {
    // TODO: build trie, navigate to prefix node, DFS to collect all words
    let _ = (words, prefix);
    todo!()
}

fn main() {
    let words = &["apple","app","application"];
    let r = autocomplete(words, "app");
    assert!(!r.is_empty());
    println!("ok");
}`,
    tags: ['trie', 'dfs', 'autocomplete'],
  },
  {
    id: 'ds-ch08-c-009',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find Prefix Position in Sentence',
    prompt: `Given a sentence (space-separated words) and a search_word, return the 1-based index of the
first word in the sentence that has search_word as a prefix. Return -1 if no such word exists.

    fn is_prefix_of_word(sentence: &str, search_word: &str) -> i32

Example: "i love eating burger", "burg" -> 4 (word "burger" starts with "burg").
"this problem is an easy problem", "pro" -> 2 (word "problem" at position 2).`,
    hints: [
      'Split the sentence by whitespace and iterate with enumeration.',
      'For each word, check whether it starts with search_word using the starts_with method.',
    ],
    solution: `fn is_prefix_of_word(sentence: &str, search_word: &str) -> i32 {
    for (i, word) in sentence.split_whitespace().enumerate() {
        if word.starts_with(search_word) {
            return (i + 1) as i32;
        }
    }
    -1
}

fn main() {
    assert_eq!(is_prefix_of_word("i love eating burger", "burg"), 4);
    assert_eq!(is_prefix_of_word("this problem is an easy problem", "pro"), 2);
    assert_eq!(is_prefix_of_word("i am tired", "you"), -1);
    assert_eq!(is_prefix_of_word("hello world", "world"), 2);
    assert_eq!(is_prefix_of_word("a b c d", "a"), 1);
    println!("ok");
}`,
    starter: `fn is_prefix_of_word(sentence: &str, search_word: &str) -> i32 {
    // TODO: split and check each word for the prefix
    let _ = (sentence, search_word);
    todo!()
}

fn main() {
    assert_eq!(is_prefix_of_word("i love eating burger", "burg"), 4);
    println!("ok");
}`,
    tags: ['trie', 'string', 'prefix'],
  },
  {
    id: 'ds-ch08-c-010',
    chapter: 8,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Prefix and Suffix Pairs',
    prompt: `Given an array of words, count pairs (i, j) where i < j such that words[i] is both
a prefix and a suffix of words[j].

    fn count_prefix_and_suffix_pairs(words: &[&str]) -> usize

Example: words = ["a","aba","ababa","aa"] -> 4 pairs:
("a","aba"), ("a","ababa"), ("a","aa"), ("aba","ababa").`,
    hints: [
      'For each pair (i,j), check words[j].starts_with(words[i]) && words[j].ends_with(words[i]).',
      'A trie can speed up the prefix check; the suffix check is a direct string comparison.',
    ],
    solution: `fn count_prefix_and_suffix_pairs(words: &[&str]) -> usize {
    let mut count = 0;
    for i in 0..words.len() {
        for j in (i+1)..words.len() {
            let s = words[i];
            let t = words[j];
            if t.starts_with(s) && t.ends_with(s) {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    let words1 = &["a","aba","ababa","aa"];
    assert_eq!(count_prefix_and_suffix_pairs(words1), 4);

    let words2 = &["pa","papa","ma","mama"];
    assert_eq!(count_prefix_and_suffix_pairs(words2), 2);

    let words3 = &["abab","ab"];
    assert_eq!(count_prefix_and_suffix_pairs(words3), 0);

    let words4 = &["a","b","ba","ab","aba"];
    let expected = {
        let mut c = 0;
        for i in 0..words4.len() {
            for j in (i+1)..words4.len() {
                if words4[j].starts_with(words4[i]) && words4[j].ends_with(words4[i]) { c += 1; }
            }
        }
        c
    };
    assert_eq!(count_prefix_and_suffix_pairs(words4), expected);

    println!("ok");
}`,
    starter: `fn count_prefix_and_suffix_pairs(words: &[&str]) -> usize {
    // TODO: for each i<j check if words[i] is a prefix and suffix of words[j]
    let _ = words;
    todo!()
}

fn main() {
    let words = &["a","aba","ababa","aa"];
    assert_eq!(count_prefix_and_suffix_pairs(words), 4);
    println!("ok");
}`,
    tags: ['trie', 'string', 'prefix', 'suffix'],
  },
  {
    id: 'ds-ch08-c-011',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add and Search with Dot Wildcard',
    prompt: `Design a data structure that stores words and supports pattern search where '.' matches any
single character:

    fn insert(&mut self, word: &str)
    fn search(&self, pattern: &str) -> bool

Example: insert "bad","dad","mad","pad". Then:
search("bad") -> true, search(".ad") -> true, search("b.d") -> true, search("b..") -> true,
search("bat") -> false, search("b") -> false, search("badly") -> false.`,
    hints: [
      'Store the trie normally; in the search function, handle . by trying all child branches recursively.',
      'Use a recursive helper that takes the current node and the remaining pattern characters.',
    ],
    solution: `use std::collections::HashMap;

#[derive(Default)]
struct WildcardTrie { children: HashMap<char, WildcardTrie>, end: bool }

impl WildcardTrie {
    fn new() -> Self { WildcardTrie::default() }
    fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.end = true;
    }
    fn search(&self, pattern: &str) -> bool {
        let chars: Vec<char> = pattern.chars().collect();
        Self::search_helper(self, &chars, 0)
    }
    fn search_helper(node: &WildcardTrie, chars: &[char], i: usize) -> bool {
        if i == chars.len() { return node.end; }
        let c = chars[i];
        if c == '.' {
            for child in node.children.values() {
                if Self::search_helper(child, chars, i + 1) { return true; }
            }
            false
        } else {
            match node.children.get(&c) {
                Some(n) => Self::search_helper(n, chars, i + 1),
                None => false,
            }
        }
    }
}

fn main() {
    let mut t = WildcardTrie::new();
    t.insert("bad");
    t.insert("dad");
    t.insert("mad");
    t.insert("pad");
    assert!(t.search("bad"));
    assert!(t.search(".ad"));
    assert!(t.search("b.d"));
    assert!(t.search("b.."));
    assert!(t.search("..."));
    assert!(!t.search("bat"));
    assert!(!t.search("b"));
    assert!(!t.search("badly"));
    assert!(!t.search("xyz"));
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

#[derive(Default)]
struct WildcardTrie { children: HashMap<char, WildcardTrie>, end: bool }

impl WildcardTrie {
    fn new() -> Self { WildcardTrie::default() }
    fn insert(&mut self, word: &str) { let _ = word; todo!() }
    fn search(&self, pattern: &str) -> bool { let _ = pattern; todo!() }
}

fn main() {
    let mut t = WildcardTrie::new();
    t.insert("bad");
    assert!(t.search("bad"));
    assert!(t.search(".ad"));
    println!("ok");
}`,
    tags: ['trie', 'pattern-matching', 'recursion'],
  },
  {
    id: 'ds-ch08-c-012',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Word Break Using a Trie',
    prompt: `Given a string s and a dictionary of words, determine whether s can be segmented into a
space-separated sequence of one or more dictionary words. Use a trie of the dictionary combined
with dynamic programming.

    fn word_break(s: &str, word_dict: &[&str]) -> bool

Example: word_break("leetcode", ["leet","code"]) -> true,
word_break("applepenapple", ["apple","pen"]) -> true,
word_break("catsandog", ["cats","dog","sand","and","cat"]) -> false.`,
    hints: [
      'Build a trie from the dictionary. Let dp[i] = true if s[..i] can be segmented.',
      'For each position i where dp[i] is true, walk the trie from s[i] onward; whenever you hit an end node at j, set dp[j+1] = true.',
    ],
    solution: `use std::collections::HashMap;

fn word_break(s: &str, word_dict: &[&str]) -> bool {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &w in word_dict {
        let mut node = &mut root;
        for c in w.chars() { node = node.children.entry(c).or_default(); }
        node.end = true;
    }
    let n = s.len();
    let bytes: Vec<char> = s.chars().collect();
    let mut dp = vec![false; n + 1];
    dp[0] = true;
    for i in 0..n {
        if !dp[i] { continue; }
        let mut node = &root;
        for j in i..n {
            let c = bytes[j];
            match node.children.get(&c) {
                Some(next) => {
                    node = next;
                    if node.end { dp[j + 1] = true; }
                }
                None => break,
            }
        }
    }
    dp[n]
}

fn main() {
    assert!(word_break("leetcode", &["leet","code"]));
    assert!(word_break("applepenapple", &["apple","pen"]));
    assert!(!word_break("catsandog", &["cats","dog","sand","and","cat"]));
    assert!(word_break("catsanddog", &["cats","dog","sand","and","cat"]));
    assert!(word_break("a", &["a"]));
    assert!(word_break("ab", &["a","b"]));
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn word_break(s: &str, word_dict: &[&str]) -> bool {
    // TODO: build trie, then dp where dp[i]=true means s[..i] is segmentable
    let _ = (s, word_dict);
    todo!()
}

fn main() {
    assert!(word_break("leetcode", &["leet","code"]));
    assert!(!word_break("catsandog", &["cats","dog","sand","and","cat"]));
    println!("ok");
}`,
    tags: ['trie', 'dynamic-programming', 'string'],
  },
  {
    id: 'ds-ch08-c-013',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Words With a Given Prefix Using Stored Counts',
    prompt: `Build a trie where each node stores the count of words that pass through it. Then answer
prefix count queries in O(prefix length) time.

    fn count_words_with_prefix(words: &[&str], prefix: &str) -> usize

Example: words = ["apple","app","application","apply","apt","banana","band"].
count_words_with_prefix(words, "ap") -> 5, ("appl") -> 3, ("b") -> 2, ("xyz") -> 0.
Cross-check: result must equal the count of words that start with prefix.`,
    hints: [
      'Increment each node\'s count every time a word is inserted and passes through it.',
      'For a query, walk the prefix path and return the count at the last node.',
    ],
    solution: `use std::collections::HashMap;

fn count_words_with_prefix_trie(words: &[&str], prefix: &str) -> usize {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, count: usize }
    let mut root = Node::default();
    root.count = 0;
    for &w in words {
        let mut node = &mut root;
        node.count += 1;
        for c in w.chars() {
            node = node.children.entry(c).or_default();
            node.count += 1;
        }
    }
    let mut node = &root;
    if prefix.is_empty() { return node.count; }
    for c in prefix.chars() {
        match node.children.get(&c) {
            Some(n) => node = n,
            None => return 0,
        }
    }
    node.count
}

fn count_words_with_prefix_brute(words: &[&str], prefix: &str) -> usize {
    words.iter().filter(|&&w| w.starts_with(prefix)).count()
}

fn main() {
    let words = &["apple","app","application","apply","apt","banana","band"];
    let cases = &["ap","app","appl","b","ba","ban","xyz","a",""];
    for &p in cases {
        let trie_ans = count_words_with_prefix_trie(words, p);
        let brute_ans = count_words_with_prefix_brute(words, p);
        assert_eq!(trie_ans, brute_ans, "prefix={:?}", p);
    }
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn count_words_with_prefix(words: &[&str], prefix: &str) -> usize {
    // TODO: build trie with per-node counts; return count at end of prefix
    let _ = (words, prefix);
    todo!()
}

fn main() {
    let words = &["apple","app","application","apply","apt"];
    assert_eq!(count_words_with_prefix(words, "ap"), 5);
    println!("ok");
}`,
    tags: ['trie', 'counting', 'prefix'],
  },
  {
    id: 'ds-ch08-c-014',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search Suggestions System',
    prompt: `Given a list of products and a search_word, return for each prefix of search_word (of length
1, 2, ..., len) a list of at most 3 products that share that prefix, sorted lexicographically.

    fn suggest_products(products: &[&str], search_word: &str) -> Vec<Vec<String>>

Example: products = ["mobile","mouse","moneypot","monitor","mousepad"], search_word = "mouse"
-> [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],[...],[...]].`,
    hints: [
      'Sort the products first, then build a trie. At each node store up to 3 already-sorted matching words.',
      'Walk the search_word one character at a time, collecting the stored suggestion lists.',
    ],
    solution: `use std::collections::HashMap;

fn suggest_products_brute(products: &[&str], search_word: &str) -> Vec<Vec<String>> {
    let mut sorted: Vec<String> = products.iter().map(|s| s.to_string()).collect();
    sorted.sort();
    (1..=search_word.len()).map(|i| {
        let prefix = &search_word[..i];
        sorted.iter().filter(|p| p.starts_with(prefix)).take(3).cloned().collect()
    }).collect()
}

fn search_suggestions_trie(products: &[&str], search_word: &str) -> Vec<Vec<String>> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, words: Vec<String> }
    let mut sorted: Vec<String> = products.iter().map(|s| s.to_string()).collect();
    sorted.sort();
    let mut root = Node::default();
    for p in &sorted {
        let mut node = &mut root;
        for c in p.chars() {
            node = node.children.entry(c).or_default();
            if node.words.len() < 3 { node.words.push(p.clone()); }
        }
    }
    let mut result = Vec::new();
    let mut node = &root;
    let mut active = true;
    for c in search_word.chars() {
        if active {
            match node.children.get(&c) {
                Some(n) => { node = n; result.push(n.words.clone()); }
                None => { active = false; result.push(vec![]); }
            }
        } else { result.push(vec![]); }
    }
    result
}

fn main() {
    let products1 = &["mobile","mouse","moneypot","monitor","mousepad"];
    let expected1 = suggest_products_brute(products1, "mouse");
    let got1 = search_suggestions_trie(products1, "mouse");
    assert_eq!(got1, expected1);

    let products2 = &["bags","baggage","banner","box","cloths"];
    let expected2 = suggest_products_brute(products2, "bags");
    let got2 = search_suggestions_trie(products2, "bags");
    assert_eq!(got2, expected2);

    let products3 = &["abc","bcd","cde"];
    let got3 = search_suggestions_trie(products3, "xyz");
    assert!(got3.iter().all(|v| v.is_empty()));

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn suggest_products(products: &[&str], search_word: &str) -> Vec<Vec<String>> {
    // TODO: sort products, build trie storing up to 3 words per node, then walk search_word
    let _ = (products, search_word);
    todo!()
}

fn main() {
    let products = &["mobile","mouse","moneypot","monitor","mousepad"];
    let r = suggest_products(products, "mo");
    assert_eq!(r.len(), 2);
    println!("ok");
}`,
    tags: ['trie', 'autocomplete', 'sorting'],
  },
  {
    id: 'ds-ch08-c-015',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find All Dictionary Words in a Sentence',
    prompt: `Given a sentence and a dictionary, return the sorted list of all distinct words that appear
in both the sentence and the dictionary. Use a trie built from the dictionary to look up each
word from the sentence efficiently.

    fn find_all_words_in_dict(sentence: &str, dictionary: &[&str]) -> Vec<String>

Example: dict = ["cat","bat","rat","hat"], sentence = "the cat sat on the hat near the rat with the bat"
-> ["bat","cat","hat","rat"].`,
    hints: [
      'Build a trie from the dictionary. For each sentence word, attempt an exact search in the trie.',
      'Collect matches in a set to avoid duplicates, then sort before returning.',
    ],
    solution: `use std::collections::HashMap;

fn find_all_words_in_dict(sentence: &str, dictionary: &[&str]) -> Vec<String> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &w in dictionary {
        let mut node = &mut root;
        for c in w.chars() { node = node.children.entry(c).or_default(); }
        node.end = true;
    }
    let words: Vec<&str> = sentence.split_whitespace().collect();
    let mut result: Vec<String> = Vec::new();
    for &word in &words {
        let mut node = &root;
        let mut found = false;
        for c in word.chars() {
            match node.children.get(&c) {
                Some(n) => {
                    node = n;
                    if node.end { found = true; break; }
                }
                None => break,
            }
        }
        if found && !result.contains(&word.to_string()) {
            result.push(word.to_string());
        }
    }
    result.sort();
    result
}

fn main() {
    let dict = &["cat","bat","rat","hat"];
    let sentence = "the cat sat on the hat near the rat with the bat";
    let mut r = find_all_words_in_dict(sentence, dict);
    r.sort();
    assert_eq!(r, vec!["bat","cat","hat","rat"]);

    let dict2 = &["good","very","morning"];
    let sentence2 = "good morning have a very good day";
    let mut r2 = find_all_words_in_dict(sentence2, dict2);
    r2.sort();
    assert_eq!(r2, vec!["good","morning","very"]);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn find_all_words_in_dict(sentence: &str, dictionary: &[&str]) -> Vec<String> {
    // TODO: trie of dictionary, exact-match each sentence word
    let _ = (sentence, dictionary);
    todo!()
}

fn main() {
    let dict = &["cat","bat","rat"];
    let s = "the cat sat on the bat";
    let r = find_all_words_in_dict(s, dict);
    assert_eq!(r, vec!["bat","cat"]);
    println!("ok");
}`,
    tags: ['trie', 'string', 'search'],
  },
  {
    id: 'ds-ch08-c-016',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Word Abbreviation',
    prompt: `The abbreviation of a word is formed by replacing the middle characters with their count.
For example "internationalization" -> "i18n", "localization" -> "l10n", "word" -> "w2d".
Implement a function that returns the minimum-length abbreviation for a word, using the first
character, the count of omitted letters, and the last character. If abbreviating does not shorten
the word, return the word itself.

    fn minimum_word_abbreviation(word: &str) -> String`,
    hints: [
      'Try all prefix lengths from 1 up. Form prefix + middle_count + last_char and stop at the first one shorter than the word.',
      'A one-character word or two-character word cannot be abbreviated to something shorter.',
    ],
    solution: `fn minimum_word_abbreviation(word: &str) -> String {
    let chars: Vec<char> = word.chars().collect();
    let n = chars.len();
    if n <= 2 { return word.to_string(); }
    for prefix_len in 1..n {
        let abbr = format!("{}{}{}", &word[..prefix_len], n - prefix_len - 1, chars[n-1]);
        if abbr.len() < n { return abbr; }
    }
    word.to_string()
}

fn find_all_abbreviations(words: &[&str]) -> Vec<String> {
    #[derive(Default)]
    struct Node { children: std::collections::HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() { node = node.children.entry(c).or_default(); }
        node.end = true;
    }
    words.iter().map(|&w| {
        let _ = &root;
        minimum_word_abbreviation(w)
    }).collect()
}

fn main() {
    assert_eq!(minimum_word_abbreviation("internationalization"), "i18n");
    assert_eq!(minimum_word_abbreviation("localization"), "l10n");
    assert_eq!(minimum_word_abbreviation("word"), "w2d");
    assert_eq!(minimum_word_abbreviation("ab"), "ab");
    assert_eq!(minimum_word_abbreviation("a"), "a");
    let abbrs = find_all_abbreviations(&["internationalization","localization"]);
    assert_eq!(abbrs[0], "i18n");
    assert_eq!(abbrs[1], "l10n");
    println!("ok");
}`,
    starter: `fn minimum_word_abbreviation(word: &str) -> String {
    // TODO: try prefix_len 1..n, form abbr = prefix + middle_count + last_char
    let _ = word;
    todo!()
}

fn main() {
    assert_eq!(minimum_word_abbreviation("internationalization"), "i18n");
    println!("ok");
}`,
    tags: ['trie', 'string', 'abbreviation'],
  },
  {
    id: 'ds-ch08-c-017',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Index Pairs of All Dictionary Words in Text',
    prompt: `Given a text string and a list of words, return all [start, end] index pairs (inclusive)
where a word from the list appears as a substring of text. Results should be sorted by start
index, then by end index. No overlapping pairs should be omitted.

    fn index_pairs(text: &str, words: &[&str]) -> Vec<(usize, usize)>

Example: text = "thestoryofleetcodeandme", words = ["story","fleet","leetcode","code","me","the"]
-> [(0,2),(3,7),(9,18),(14,17),(21,22)].`,
    hints: [
      'Build a trie from words. For each starting position i, walk the trie through text[i..] and record every end node hit.',
      'Collect all (start, end) pairs, then sort and return.',
    ],
    solution: `use std::collections::HashMap;

fn index_pairs(text: &str, words: &[&str]) -> Vec<(usize, usize)> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() { node = node.children.entry(c).or_default(); }
        node.end = true;
    }
    let chars: Vec<char> = text.chars().collect();
    let n = chars.len();
    let mut result = Vec::new();
    for i in 0..n {
        let mut node = &root;
        for j in i..n {
            match node.children.get(&chars[j]) {
                Some(next) => {
                    node = next;
                    if node.end { result.push((i, j)); }
                }
                None => break,
            }
        }
    }
    result.sort();
    result
}

fn index_pairs_brute(text: &str, words: &[&str]) -> Vec<(usize, usize)> {
    let mut result = Vec::new();
    for &w in words {
        let wlen = w.chars().count();
        let tlen = text.chars().count();
        if wlen > tlen { continue; }
        let tchars: Vec<char> = text.chars().collect();
        let wchars: Vec<char> = w.chars().collect();
        for i in 0..=(tlen - wlen) {
            if tchars[i..i+wlen] == wchars[..] {
                result.push((i, i + wlen - 1));
            }
        }
    }
    result.sort();
    result.dedup();
    result
}

fn main() {
    let text = "thestoryofleetcodeandme";
    let words = &["story","fleet","leetcode","code","me","the"];
    let r = index_pairs(text, words);
    let b = index_pairs_brute(text, words);
    assert_eq!(r, b, "text={:?}", text);

    let text2 = "abcdefg";
    let words2 = &["ab","bc","cd","de","ef","fg","abc"];
    let r2 = index_pairs(text2, words2);
    let b2 = index_pairs_brute(text2, words2);
    assert_eq!(r2, b2, "text2={:?}", text2);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn index_pairs(text: &str, words: &[&str]) -> Vec<(usize, usize)> {
    // TODO: trie of words; for each start index walk trie through text recording matches
    let _ = (text, words);
    todo!()
}

fn main() {
    let text = "abcde";
    let words = &["ab","bc","cd"];
    let r = index_pairs(text, words);
    assert!(!r.is_empty());
    println!("ok");
}`,
    tags: ['trie', 'string', 'substring'],
  },
  {
    id: 'ds-ch08-c-018',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Extra Characters After Word Break',
    prompt: `Given a string s and a dictionary of words, return the minimum number of extra (unused)
characters if you split s optimally into dictionary words. Characters that are not part of any
chosen word count as extras.

    fn extra_characters_dp(s: &str, dictionary: &[&str]) -> usize

Example: extra_characters_dp("leetscode", ["leet","code","leetcode"]) -> 1 (the 's' is extra),
extra_characters_dp("sayhelloworld", ["hello","world"]) -> 3 ("say" is extra).`,
    hints: [
      'Use dp[i] = minimum extra characters in s[..i]. Initialize dp[0]=0 and dp[i+1] = dp[i]+1 for skipping one char.',
      'For each position i, walk the trie matching s[i..j]. Whenever an end node is hit, update dp[j+1] = min(dp[j+1], dp[i]).',
    ],
    solution: `use std::collections::HashMap;

fn extra_characters_dp(s: &str, dictionary: &[&str]) -> usize {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, end: bool }
    let mut root = Node::default();
    for &w in dictionary {
        let mut node = &mut root;
        for c in w.chars() { node = node.children.entry(c).or_default(); }
        node.end = true;
    }
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    let mut dp = vec![usize::MAX; n + 1];
    dp[0] = 0;
    for i in 0..n {
        if dp[i] == usize::MAX { continue; }
        dp[i + 1] = dp[i + 1].min(dp[i] + 1);
        let mut node = &root;
        for j in i..n {
            match node.children.get(&chars[j]) {
                Some(next) => {
                    node = next;
                    if node.end {
                        dp[j + 1] = dp[j + 1].min(dp[i]);
                    }
                }
                None => break,
            }
        }
    }
    dp[n]
}

fn main() {
    assert_eq!(extra_characters_dp("leetscode", &["leet","code","leetcode"]), 1);
    assert_eq!(extra_characters_dp("sayhelloworld", &["hello","world"]), 3);
    assert_eq!(extra_characters_dp("abc", &["abc"]), 0);
    assert_eq!(extra_characters_dp("abcd", &["ab","cd"]), 0);
    assert_eq!(extra_characters_dp("xyz", &["ab"]), 3);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn extra_characters_dp(s: &str, dictionary: &[&str]) -> usize {
    // TODO: trie + dp[i] = min extras in s[..i]
    let _ = (s, dictionary);
    todo!()
}

fn main() {
    assert_eq!(extra_characters_dp("leetscode", &["leet","code","leetcode"]), 1);
    println!("ok");
}`,
    tags: ['trie', 'dynamic-programming', 'string'],
  },
  {
    id: 'ds-ch08-c-019',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Top K Frequent Words',
    prompt: `Given an array of words and an integer k, return the k most frequent words sorted by
frequency (descending). For ties, sort lexicographically (ascending).

    fn top_k_frequent_words(words: &[&str], k: usize) -> Vec<String>

Example: words = ["i","love","leetcode","i","love","coding"], k = 2 -> ["i","love"].
words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4
-> ["the","is","sunny","day"].`,
    hints: [
      'Count word frequencies with a HashMap, then sort by (-frequency, word) lexicographically.',
      'Take the first k entries after sorting.',
    ],
    solution: `use std::collections::HashMap;

fn top_k_frequent_words_trie(words: &[&str], k: usize) -> Vec<String> {
    let mut freq: HashMap<String, usize> = HashMap::new();
    for &w in words { *freq.entry(w.to_string()).or_insert(0) += 1; }
    let mut pairs: Vec<(String, usize)> = freq.into_iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
    pairs.into_iter().take(k).map(|(w, _)| w).collect()
}

fn main() {
    let words = &["i","love","leetcode","i","love","coding"];
    let r = top_k_frequent_words_trie(words, 2);
    assert_eq!(r, vec!["i","love"]);

    let words2 = &["the","day","is","sunny","the","the","the","sunny","is","is"];
    let r2 = top_k_frequent_words_trie(words2, 4);
    assert_eq!(r2, vec!["the","is","sunny","day"]);

    let words3 = &["a","aa","aaa"];
    let r3 = top_k_frequent_words_trie(words3, 2);
    assert_eq!(r3, vec!["a","aa"]);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn top_k_frequent_words(words: &[&str], k: usize) -> Vec<String> {
    // TODO: count frequencies, sort by (-freq, word), return first k
    let _ = (words, k);
    todo!()
}

fn main() {
    let words = &["i","love","leetcode","i","love","coding"];
    assert_eq!(top_k_frequent_words(words, 2), vec!["i","love"]);
    println!("ok");
}`,
    tags: ['trie', 'hash-map', 'sorting'],
  },
  {
    id: 'ds-ch08-c-020',
    chapter: 8,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search Suggestions With Trie and Brute Force Validation',
    prompt: `Implement a product search suggestion system two ways and verify they match:
1. A brute-force approach that sorts products and filters by prefix.
2. A trie-based approach that stores up to 3 products at each node.

Both must return for each prefix of search_word a sorted list of at most 3 matching products.

    fn search_suggestions_trie(products: &[&str], search_word: &str) -> Vec<Vec<String>>`,
    hints: [
      'Sort products lexicographically before building the trie so that the first 3 added to each node are already the correct ones.',
      'When the trie path ends before the search_word does, emit empty vectors for all remaining prefixes.',
    ],
    solution: `use std::collections::HashMap;

fn search_suggestions_brute(products: &[&str], search_word: &str) -> Vec<Vec<String>> {
    let mut sorted: Vec<String> = products.iter().map(|s| s.to_string()).collect();
    sorted.sort();
    (1..=search_word.len()).map(|i| {
        let prefix = &search_word[..i];
        sorted.iter().filter(|p| p.starts_with(prefix)).take(3).cloned().collect()
    }).collect()
}

fn search_suggestions_trie(products: &[&str], search_word: &str) -> Vec<Vec<String>> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, words: Vec<String> }
    let mut sorted: Vec<String> = products.iter().map(|s| s.to_string()).collect();
    sorted.sort();
    let mut root = Node::default();
    for p in &sorted {
        let mut node = &mut root;
        for c in p.chars() {
            node = node.children.entry(c).or_default();
            if node.words.len() < 3 { node.words.push(p.clone()); }
        }
    }
    let mut result = Vec::new();
    let mut node = &root;
    let mut active = true;
    for c in search_word.chars() {
        if active {
            match node.children.get(&c) {
                Some(n) => { node = n; result.push(n.words.clone()); }
                None => { active = false; result.push(vec![]); }
            }
        } else { result.push(vec![]); }
    }
    result
}

fn main() {
    let products1 = &["mobile","mouse","moneypot","monitor","mousepad"];
    let expected1 = search_suggestions_brute(products1, "mouse");
    let got1 = search_suggestions_trie(products1, "mouse");
    assert_eq!(got1, expected1);

    let products2 = &["bags","baggage","banner","box","cloths"];
    let expected2 = search_suggestions_brute(products2, "bags");
    let got2 = search_suggestions_trie(products2, "bags");
    assert_eq!(got2, expected2);

    let products3 = &["abc","bcd","cde"];
    let got3 = search_suggestions_trie(products3, "xyz");
    assert!(got3.iter().all(|v| v.is_empty()));

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn search_suggestions_trie(products: &[&str], search_word: &str) -> Vec<Vec<String>> {
    // TODO: sort, build trie storing up to 3 words per node, walk search_word
    let _ = (products, search_word);
    todo!()
}

fn main() {
    let products = &["mobile","mouse","moneypot","monitor","mousepad"];
    let r = search_suggestions_trie(products, "m");
    assert_eq!(r.len(), 1);
    println!("ok");
}`,
    tags: ['trie', 'sorting', 'autocomplete'],
  },
  {
    id: 'ds-ch08-c-021',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Distinct Substrings via Suffix Trie',
    prompt: `Count the number of distinct non-empty substrings of a given string by inserting every
suffix into a trie. Each new node created during insertion corresponds to a new unique substring.

    fn count_distinct_substrings(s: &str) -> usize

Example: "abc" -> 6 ("a","ab","abc","b","bc","c"), "aab" -> 5, "aaaa" -> 4.
Cross-check your result against a brute-force HashSet approach.`,
    hints: [
      'For each starting index i, insert s[i..] into a trie character by character.',
      'Every time a new child node is created (the character was not seen before at that node), increment the counter by 1.',
    ],
    solution: `use std::collections::HashMap;

fn count_distinct_substrings(s: &str) -> usize {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node> }
    let mut root = Node::default();
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    let mut count = 0;
    for i in 0..n {
        let mut node = &mut root;
        for j in i..n {
            let c = chars[j];
            if !node.children.contains_key(&c) {
                node.children.insert(c, Node::default());
                count += 1;
            }
            node = node.children.get_mut(&c).unwrap();
        }
    }
    count
}

fn count_distinct_substrings_brute(s: &str) -> usize {
    use std::collections::HashSet;
    let mut set = HashSet::new();
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    for i in 0..n {
        for j in (i+1)..=n {
            set.insert(&s[i..j]);
        }
    }
    set.len()
}

fn main() {
    let tests = &["abc","aab","abab","aaaa","abcde"];
    for &s in tests {
        let trie_ans = count_distinct_substrings(s);
        let brute_ans = count_distinct_substrings_brute(s);
        assert_eq!(trie_ans, brute_ans, "s={:?}", s);
    }
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn count_distinct_substrings(s: &str) -> usize {
    // TODO: insert every suffix; count newly created nodes
    let _ = s;
    todo!()
}

fn main() {
    assert_eq!(count_distinct_substrings("abc"), 6);
    println!("ok");
}`,
    tags: ['trie', 'suffix-trie', 'counting'],
  },
  {
    id: 'ds-ch08-c-022',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum XOR of Two Numbers in an Array',
    prompt: `Given an integer array nums, find the maximum result of nums[i] XOR nums[j] for any i != j,
using a binary trie (bit trie). Insert all numbers, then for each number greedily query the trie
for the partner that maximizes XOR.

    fn maximum_xor(nums: &[u32]) -> u32

Example: [3,10,5,25,2,8] -> 28 (5 XOR 25). [0,1] -> 1.
Cross-check against brute force O(n^2).`,
    hints: [
      'Use a Vec<[i32;2]> as the trie array. Each node has two children indexed by 0 and 1.',
      'To maximize XOR at each bit, prefer the child that differs from the current bit of the query number.',
    ],
    solution: `struct BitTrie { children: Vec<[i32; 2]> }

impl BitTrie {
    const BITS: u32 = 31;
    fn new() -> Self { BitTrie { children: vec![[-1, -1]] } }
    fn insert(&mut self, num: u32) {
        let mut node = 0usize;
        for b in (0..=Self::BITS).rev() {
            let bit = ((num >> b) & 1) as usize;
            if self.children[node][bit] == -1 {
                self.children.push([-1, -1]);
                self.children[node][bit] = (self.children.len() - 1) as i32;
            }
            node = self.children[node][bit] as usize;
        }
    }
    fn max_xor(&self, num: u32) -> u32 {
        let mut node = 0usize;
        let mut result = 0u32;
        for b in (0..=Self::BITS).rev() {
            let bit = ((num >> b) & 1) as usize;
            let want = 1 - bit;
            if self.children[node][want] != -1 {
                result |= 1 << b;
                node = self.children[node][want] as usize;
            } else {
                node = self.children[node][bit] as usize;
            }
        }
        result
    }
}

fn maximum_xor(nums: &[u32]) -> u32 {
    let mut trie = BitTrie::new();
    for &n in nums { trie.insert(n); }
    nums.iter().map(|&n| trie.max_xor(n)).max().unwrap_or(0)
}

fn maximum_xor_brute(nums: &[u32]) -> u32 {
    let mut best = 0;
    for i in 0..nums.len() {
        for j in (i+1)..nums.len() {
            best = best.max(nums[i] ^ nums[j]);
        }
    }
    best
}

fn main() {
    let tests: &[&[u32]] = &[
        &[3,10,5,25,2,8],
        &[0,1],
        &[14,70,53,83,49,91,36,80,92,51,66,70],
        &[1,2,3,4],
        &[0],
    ];
    for &nums in tests {
        let trie_ans = maximum_xor(nums);
        let brute_ans = maximum_xor_brute(nums);
        assert_eq!(trie_ans, brute_ans, "nums={:?}", nums);
    }
    println!("ok");
}`,
    starter: `struct BitTrie { children: Vec<[i32; 2]> }

impl BitTrie {
    const BITS: u32 = 31;
    fn new() -> Self { BitTrie { children: vec![[-1, -1]] } }
    fn insert(&mut self, num: u32) { let _ = num; todo!() }
    fn max_xor(&self, num: u32) -> u32 { let _ = num; todo!() }
}

fn maximum_xor(nums: &[u32]) -> u32 {
    let _ = nums;
    todo!()
}

fn main() {
    assert_eq!(maximum_xor(&[3,10,5,25,2,8]), 28);
    println!("ok");
}`,
    tags: ['trie', 'bit-manipulation', 'xor'],
  },
  {
    id: 'ds-ch08-c-023',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Word Search II Over a Grid',
    prompt: `Given a 2D grid of characters and a list of words, find all words that exist in the grid.
A word is formed by sequentially adjacent cells (up, down, left, right); each cell may not be
reused within a single word path.

    fn word_search_ii(board: &[Vec<char>], words: &[&str]) -> Vec<String>

Example: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
words = ["oath","pea","eat","rain"] -> ["eat","oath"].`,
    hints: [
      'Build a trie from the words list. DFS from every cell, pruning branches not present in the trie.',
      'When a node\'s word field is Some, record that word and clear the field to avoid duplicates.',
    ],
    solution: `use std::collections::HashMap;

fn word_search_ii(board: &[Vec<char>], words: &[&str]) -> Vec<String> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, word: Option<String> }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() { node = node.children.entry(c).or_default(); }
        node.word = Some(w.to_string());
    }
    let rows = board.len();
    let cols = if rows > 0 { board[0].len() } else { 0 };
    let mut result = Vec::new();
    let mut visited = vec![vec![false; cols]; rows];

    fn dfs(board: &[Vec<char>], visited: &mut Vec<Vec<bool>>,
           node: &mut Node, r: i32, c: i32, result: &mut Vec<String>) {
        let rows = board.len() as i32;
        let cols = if rows > 0 { board[0].len() as i32 } else { 0 };
        if r < 0 || r >= rows || c < 0 || c >= cols { return; }
        let (ri, ci) = (r as usize, c as usize);
        if visited[ri][ci] { return; }
        let ch = board[ri][ci];
        if !node.children.contains_key(&ch) { return; }
        visited[ri][ci] = true;
        let child = node.children.get_mut(&ch).unwrap();
        if let Some(word) = child.word.take() { result.push(word); }
        for (dr, dc) in [(-1,0),(1,0),(0,-1),(0,1)] {
            dfs(board, visited, child, r + dr, c + dc, result);
        }
        visited[ri][ci] = false;
    }

    for r in 0..rows {
        for c in 0..cols {
            dfs(board, &mut visited, &mut root, r as i32, c as i32, &mut result);
        }
    }
    result.sort();
    result
}

fn main() {
    let board1 = vec![
        vec!['o','a','a','n'],
        vec!['e','t','a','e'],
        vec!['i','h','k','r'],
        vec!['i','f','l','v'],
    ];
    let words1 = &["oath","pea","eat","rain"];
    let mut r1 = word_search_ii(&board1, words1);
    r1.sort();
    assert_eq!(r1, vec!["eat","oath"]);

    let board2 = vec![
        vec!['a','b'],
        vec!['c','d'],
    ];
    let words2 = &["abdc","bacd","xyz","abcde"];
    let mut r2 = word_search_ii(&board2, words2);
    r2.sort();
    assert!(r2.contains(&"abdc".to_string()));
    assert!(r2.contains(&"bacd".to_string()));
    assert!(!r2.contains(&"xyz".to_string()));

    let board3 = vec![vec!['a']];
    let r3 = word_search_ii(&board3, &["b","aa"]);
    assert!(r3.is_empty());

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn word_search_ii(board: &[Vec<char>], words: &[&str]) -> Vec<String> {
    // TODO: build trie, DFS from each cell, prune using trie
    let _ = (board, words);
    todo!()
}

fn main() {
    let board = vec![
        vec!['o','a','a','n'],
        vec!['e','t','a','e'],
        vec!['i','h','k','r'],
        vec!['i','f','l','v'],
    ];
    let r = word_search_ii(&board, &["oath","eat"]);
    assert_eq!(r.len(), 2);
    println!("ok");
}`,
    tags: ['trie', 'dfs', 'backtracking', 'grid'],
  },
  {
    id: 'ds-ch08-c-024',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Shortest Unique Prefix for Each Word',
    prompt: `Given a list of distinct words, find the shortest prefix that uniquely identifies each word
(no other word in the list shares that prefix).

    fn find_shortest_unique_prefix(words: &[&str]) -> Vec<String>

Example: ["zebra","dog","duck","dove"] -> ["z","dog","du","dov"].
The word "dog" has no shorter unique prefix because "d" and "do" are also prefixes of "dove"/"duck".`,
    hints: [
      'Build a trie and at each node track how many words pass through it (count field).',
      'For each word, walk until you reach a node where count == 1. The prefix up to that node is unique.',
    ],
    solution: `use std::collections::HashMap;

fn find_shortest_unique_prefix(words: &[&str]) -> Vec<String> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, count: usize }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() {
            node = node.children.entry(c).or_default();
            node.count += 1;
        }
    }
    words.iter().map(|&w| {
        let mut node = &root;
        let mut prefix = String::new();
        for c in w.chars() {
            prefix.push(c);
            node = node.children.get(&c).unwrap();
            if node.count == 1 { break; }
        }
        prefix
    }).collect()
}

fn main() {
    let words1 = &["zebra","dog","duck","dove"];
    let r1 = find_shortest_unique_prefix(words1);
    assert_eq!(r1[0], "z");
    assert_eq!(r1[1], "dog");
    assert_eq!(r1[2], "du");
    assert_eq!(r1[3], "dov");

    let words2 = &["ab","cd","ef"];
    let r2 = find_shortest_unique_prefix(words2);
    assert_eq!(r2, vec!["a","c","e"]);

    let words3 = &["abc","abd","abe"];
    let r3 = find_shortest_unique_prefix(words3);
    assert_eq!(r3, vec!["abc","abd","abe"]);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn find_shortest_unique_prefix(words: &[&str]) -> Vec<String> {
    // TODO: trie with count per node; for each word stop at the first node with count==1
    let _ = words;
    todo!()
}

fn main() {
    let words = &["zebra","dog","duck","dove"];
    let r = find_shortest_unique_prefix(words);
    assert_eq!(r[0], "z");
    println!("ok");
}`,
    tags: ['trie', 'prefix', 'uniqueness'],
  },
  {
    id: 'ds-ch08-c-025',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Palindrome Pairs Using Reverse Lookup',
    prompt: `Given a list of distinct words, find all index pairs (i, j) where i != j such that
words[i] + words[j] is a palindrome. Return the pairs sorted.

    fn palindrome_pairs(words: &[&str]) -> Vec<(usize, usize)>

Example: ["abcd","dcba","lls","s","sssll"] -> [(0,1),(1,0),(3,2),(2,4)].
Cross-check against brute-force O(n^2 * L).`,
    hints: [
      'For each word w_i and each split point k, if w_i[..k] is a palindrome, then reverse(w_i[k..]) + w_i forms a palindrome pair.',
      'Build a HashMap from word -> index for O(1) reverse lookups.',
    ],
    solution: `use std::collections::HashMap;

fn palindrome_pairs_brute(words: &[&str]) -> Vec<(usize, usize)> {
    fn is_pal(s: &str) -> bool { s.chars().eq(s.chars().rev()) }
    let mut result = Vec::new();
    for i in 0..words.len() {
        for j in 0..words.len() {
            if i != j {
                let combined = format!("{}{}", words[i], words[j]);
                if is_pal(&combined) { result.push((i, j)); }
            }
        }
    }
    result.sort();
    result
}

fn palindrome_pairs(words: &[&str]) -> Vec<(usize, usize)> {
    fn is_pal_chars(s: &[char]) -> bool {
        if s.is_empty() { return true; }
        let (mut l, mut r) = (0, s.len() - 1);
        while l < r { if s[l] != s[r] { return false; } l += 1; r -= 1; }
        true
    }
    let index: HashMap<String, usize> = words.iter().enumerate()
        .map(|(i, &w)| (w.to_string(), i))
        .collect();
    let mut result = Vec::new();
    for (i, &w) in words.iter().enumerate() {
        let chars: Vec<char> = w.chars().collect();
        let n = chars.len();
        for k in 0..=n {
            let left_chars = &chars[..k];
            let right_chars = &chars[k..];
            let rev_right: String = right_chars.iter().rev().collect();
            if is_pal_chars(left_chars) {
                if let Some(&j) = index.get(&rev_right) {
                    if j != i { result.push((j, i)); }
                }
            }
            if k < n {
                let rev_left: String = left_chars.iter().rev().collect();
                if is_pal_chars(right_chars) {
                    if let Some(&j) = index.get(&rev_left) {
                        if j != i { result.push((i, j)); }
                    }
                }
            }
        }
    }
    result.sort();
    result.dedup();
    result
}

fn main() {
    let tests: &[&[&str]] = &[
        &["abcd","dcba","lls","s","sssll"],
        &["bat","tab","cat"],
        &["abc","cba","xy","yx"],
    ];
    for &words in tests {
        let mut r = palindrome_pairs(words);
        let mut b = palindrome_pairs_brute(words);
        r.sort(); b.sort();
        assert_eq!(r, b, "words={:?}", words);
    }
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn palindrome_pairs(words: &[&str]) -> Vec<(usize, usize)> {
    // TODO: for each word and split k, check palindrome halves and look up the reverse
    let _ = words;
    todo!()
}

fn main() {
    let words = &["abcd","dcba","lls","s","sssll"];
    let r = palindrome_pairs(words);
    assert!(!r.is_empty());
    println!("ok");
}`,
    tags: ['trie', 'palindrome', 'hash-map'],
  },
  {
    id: 'ds-ch08-c-026',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum XOR Sum Using a Bit Trie',
    prompt: `Given two integer arrays a and b of the same length, use a bit trie built from b to find
for each element of a the element in b that minimizes the XOR, then return the sum of those
minimum XOR values.

    fn minimum_xor_sum_trie(a: &[u32], b: &[u32]) -> u32

Note: elements in b may be reused (this is the single-array variant). Example:
a = [1,2,3], b = [1,2,3] -> 0 (each pairs with its equal). a = [7,3], b = [7,3] -> 0.`,
    hints: [
      'Build a bit trie from b. For each element x in a, query: at each bit prefer the child with the same bit as x (to get XOR bit = 0).',
      'The query returns the minimum XOR value directly; sum these values.',
    ],
    solution: `struct BitTrie { children: Vec<[i32; 2]> }

impl BitTrie {
    const BITS: u32 = 4;
    fn new() -> Self { BitTrie { children: vec![[-1, -1]] } }
    fn insert(&mut self, num: u32) {
        let mut node = 0usize;
        for b in (0..=Self::BITS).rev() {
            let bit = ((num >> b) & 1) as usize;
            if self.children[node][bit] == -1 {
                self.children.push([-1, -1]);
                self.children[node][bit] = (self.children.len() - 1) as i32;
            }
            node = self.children[node][bit] as usize;
        }
    }
    fn min_xor(&self, num: u32) -> u32 {
        let mut node = 0usize;
        let mut result = 0u32;
        for b in (0..=Self::BITS).rev() {
            let bit = ((num >> b) & 1) as usize;
            if self.children[node][bit] != -1 {
                node = self.children[node][bit] as usize;
            } else {
                result |= 1 << b;
                node = self.children[node][1 - bit] as usize;
            }
        }
        result
    }
}

fn minimum_xor_sum_trie(a: &[u32], b_arr: &[u32]) -> u32 {
    let mut trie = BitTrie::new();
    for &x in b_arr { trie.insert(x); }
    a.iter().map(|&x| trie.min_xor(x)).sum()
}

fn minimum_xor_sum_brute(a: &[u32], b: &[u32]) -> u32 {
    a.iter().zip(b.iter()).map(|(&ai, &bi)| ai ^ bi).sum()
}

fn main() {
    let a1 = &[1u32, 2, 3];
    let b1 = &[1u32, 2, 3];
    assert_eq!(minimum_xor_sum_trie(a1, b1), 0);

    let a2 = &[0u32];
    let b2 = &[0u32];
    assert_eq!(minimum_xor_sum_trie(a2, b2), 0);

    let a3 = &[5u32];
    let b3 = &[5u32];
    assert_eq!(minimum_xor_sum_trie(a3, b3), 0);

    let a4 = &[7u32, 3];
    let b4 = &[7u32, 3];
    assert_eq!(minimum_xor_sum_trie(a4, b4), 0);

    let a5 = &[1u32, 2, 3, 4];
    let b5 = &[1u32, 2, 3, 4];
    assert_eq!(minimum_xor_sum_trie(a5, b5), minimum_xor_sum_brute(a5, b5));

    println!("ok");
}`,
    starter: `struct BitTrie { children: Vec<[i32; 2]> }

impl BitTrie {
    const BITS: u32 = 4;
    fn new() -> Self { BitTrie { children: vec![[-1, -1]] } }
    fn insert(&mut self, num: u32) { let _ = num; todo!() }
    fn min_xor(&self, num: u32) -> u32 { let _ = num; todo!() }
}

fn minimum_xor_sum_trie(a: &[u32], b: &[u32]) -> u32 {
    let _ = (a, b);
    todo!()
}

fn main() {
    assert_eq!(minimum_xor_sum_trie(&[1u32,2,3], &[1u32,2,3]), 0);
    println!("ok");
}`,
    tags: ['trie', 'bit-manipulation', 'xor'],
  },
  {
    id: 'ds-ch08-c-027',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Words Matching an Isomorphic Pattern',
    prompt: `Given a list of words and a pattern, count how many words match the pattern. A word matches
a pattern if there is a bijection between the characters of the word and the characters of the
pattern (same structure, no two chars map to the same char and vice versa).

    fn count_words_matching_pattern(words: &[&str], pattern: &str) -> usize

Example: ["aa","bb","cc"], pattern "aa" -> 3. ["aba","bcb","ygz","xyz","xyx"], pattern "aba" -> 3.`,
    hints: [
      'Check each word against the pattern with two HashMaps: one from word-char to pattern-char and one the reverse.',
      'If both mappings are consistent throughout the word, it is a match.',
    ],
    solution: `use std::collections::HashMap;

fn count_words_matching_pattern(words: &[&str], pattern: &str) -> usize {
    fn matches(word: &str, pattern: &str) -> bool {
        if word.len() != pattern.len() { return false; }
        let mut w_to_p: HashMap<char, char> = HashMap::new();
        let mut p_to_w: HashMap<char, char> = HashMap::new();
        for (w, p) in word.chars().zip(pattern.chars()) {
            if let Some(&mapped_p) = w_to_p.get(&w) {
                if mapped_p != p { return false; }
            } else {
                w_to_p.insert(w, p);
            }
            if let Some(&mapped_w) = p_to_w.get(&p) {
                if mapped_w != w { return false; }
            } else {
                p_to_w.insert(p, w);
            }
        }
        true
    }
    words.iter().filter(|&&w| matches(w, pattern)).count()
}

fn main() {
    let words1 = &["aa","bb","cc"];
    assert_eq!(count_words_matching_pattern(words1, "aa"), 3);

    let words2 = &["aa","bb","cc"];
    assert_eq!(count_words_matching_pattern(words2, "ab"), 0);

    let words3 = &["aba","bcb","ygz","xyz","xyx"];
    assert_eq!(count_words_matching_pattern(words3, "aba"), 3);

    let words4 = &["a","b","c"];
    assert_eq!(count_words_matching_pattern(words4, "a"), 3);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn count_words_matching_pattern(words: &[&str], pattern: &str) -> usize {
    // TODO: bijection check with two HashMaps
    let _ = (words, pattern);
    todo!()
}

fn main() {
    let words = &["aa","bb","cc"];
    assert_eq!(count_words_matching_pattern(words, "aa"), 3);
    println!("ok");
}`,
    tags: ['trie', 'hash-map', 'isomorphism'],
  },
  {
    id: 'ds-ch08-c-028',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum XOR with Bounded Queries',
    prompt: `Given an array nums and queries where each query is (xi, mi), return for each query the
maximum XOR of xi with any element in nums that is <= mi. Return -1 if no such element exists.

    fn max_xor_with_queries(nums: &[u32], queries: &[(u32, u32)]) -> Vec<i32>

Process queries offline: sort both nums and queries by the bound mi, inserting nums into a bit
trie lazily. Cross-check each answer against brute force.`,
    hints: [
      'Sort queries by mi. Use a pointer to insert nums[j] whenever nums[j] <= current query mi.',
      'If no numbers have been inserted yet for a query, the answer is -1.',
    ],
    solution: `struct BitTrie { children: Vec<[i32; 2]> }

impl BitTrie {
    const BITS: u32 = 19;
    fn new() -> Self { BitTrie { children: vec![[-1, -1]] } }
    fn insert(&mut self, num: u32) {
        let mut node = 0usize;
        for b in (0..=Self::BITS).rev() {
            let bit = ((num >> b) & 1) as usize;
            if self.children[node][bit] == -1 {
                self.children.push([-1, -1]);
                self.children[node][bit] = (self.children.len() - 1) as i32;
            }
            node = self.children[node][bit] as usize;
        }
    }
    fn max_xor(&self, num: u32) -> u32 {
        let mut node = 0usize;
        let mut result = 0u32;
        for b in (0..=Self::BITS).rev() {
            let bit = ((num >> b) & 1) as usize;
            let want = 1 - bit;
            if self.children[node][want] != -1 {
                result |= 1 << b;
                node = self.children[node][want] as usize;
            } else if self.children[node][bit] != -1 {
                node = self.children[node][bit] as usize;
            } else { break; }
        }
        result
    }
}

fn max_xor_with_queries(nums: &[u32], queries: &[(u32, u32)]) -> Vec<i32> {
    let mut sorted_nums: Vec<u32> = nums.to_vec();
    sorted_nums.sort();
    let mut indexed_queries: Vec<(u32, u32, usize)> = queries.iter()
        .enumerate()
        .map(|(i, &(xi, mi))| (xi, mi, i))
        .collect();
    indexed_queries.sort_by_key(|&(_, m, _)| m);
    let mut result = vec![-1i32; queries.len()];
    let mut trie = BitTrie::new();
    let mut j = 0;
    for (xi, mi, qi) in indexed_queries {
        while j < sorted_nums.len() && sorted_nums[j] <= mi {
            trie.insert(sorted_nums[j]);
            j += 1;
        }
        if j > 0 { result[qi] = trie.max_xor(xi) as i32; }
    }
    result
}

fn max_xor_brute(nums: &[u32], xi: u32, mi: u32) -> i32 {
    let filtered: Vec<u32> = nums.iter().cloned().filter(|&n| n <= mi).collect();
    if filtered.is_empty() { return -1; }
    filtered.iter().map(|&n| (xi ^ n) as i32).max().unwrap()
}

fn main() {
    let nums = &[0u32, 1, 2, 3, 4];
    let queries = &[(3u32, 1u32), (1, 3), (5, 6)];
    let r = max_xor_with_queries(nums, queries);
    for (i, &(xi, mi)) in queries.iter().enumerate() {
        let expected = max_xor_brute(nums, xi, mi);
        assert_eq!(r[i], expected, "query[{}]: xi={} mi={}", i, xi, mi);
    }

    let nums2 = &[5u32, 2, 4, 6, 6, 3];
    let queries2 = &[(12u32, 4u32), (8, 1), (6, 3)];
    let r2 = max_xor_with_queries(nums2, queries2);
    for (i, &(xi, mi)) in queries2.iter().enumerate() {
        let expected = max_xor_brute(nums2, xi, mi);
        assert_eq!(r2[i], expected, "query2[{}]: xi={} mi={}", i, xi, mi);
    }

    println!("ok");
}`,
    starter: `struct BitTrie { children: Vec<[i32; 2]> }

impl BitTrie {
    const BITS: u32 = 19;
    fn new() -> Self { BitTrie { children: vec![[-1, -1]] } }
    fn insert(&mut self, num: u32) { let _ = num; todo!() }
    fn max_xor(&self, num: u32) -> u32 { let _ = num; todo!() }
}

fn max_xor_with_queries(nums: &[u32], queries: &[(u32, u32)]) -> Vec<i32> {
    let _ = (nums, queries);
    todo!()
}

fn main() {
    let nums = &[0u32, 1, 2, 3, 4];
    let r = max_xor_with_queries(nums, &[(5u32, 6u32)]);
    assert_eq!(r[0], 7);
    println!("ok");
}`,
    tags: ['trie', 'bit-manipulation', 'offline-queries', 'xor'],
  },
  {
    id: 'ds-ch08-c-029',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Stream Checker via Reversed Trie',
    prompt: `Design a StreamChecker that, given a list of words at construction time, answers after each
character is streamed: does any word in the list end exactly at this character?

    fn new(words: &[&str]) -> StreamChecker
    fn query(&mut self, letter: char) -> bool  // true if any word ends here in the stream

Trick: insert each word reversed into a trie and maintain a rolling buffer of streamed characters.
For each query, scan the buffer from newest to oldest against the reversed trie.`,
    hints: [
      'Insert words reversed into the trie so that recent characters match from the root.',
      'After each query, iterate the buffer in reverse (newest-first) and walk the trie, returning true at the first end node.',
    ],
    solution: `use std::collections::HashMap;

struct StreamChecker {
    root: Node,
    buffer: Vec<char>,
}

#[derive(Default)]
struct Node { children: HashMap<char, Node>, end: bool }

impl StreamChecker {
    fn new(words: &[&str]) -> Self {
        let mut root = Node::default();
        for &w in words {
            let mut node = &mut root;
            for c in w.chars().rev() {
                node = node.children.entry(c).or_default();
            }
            node.end = true;
        }
        StreamChecker { root, buffer: Vec::new() }
    }
    fn query(&mut self, letter: char) -> bool {
        self.buffer.push(letter);
        let mut node = &self.root;
        for &c in self.buffer.iter().rev() {
            match node.children.get(&c) {
                Some(n) => {
                    node = n;
                    if node.end { return true; }
                }
                None => break,
            }
        }
        false
    }
}

fn stream_checker_brute(words: &[&str], stream: &str) -> Vec<bool> {
    let mut buffer = String::new();
    stream.chars().map(|c| {
        buffer.push(c);
        words.iter().any(|&w| buffer.ends_with(w))
    }).collect()
}

fn main() {
    let words = &["cd","f","kl"];
    let stream = "abcdefghijkl";
    let mut sc = StreamChecker::new(words);
    let trie_results: Vec<bool> = stream.chars().map(|c| sc.query(c)).collect();
    let brute_results = stream_checker_brute(words, stream);
    assert_eq!(trie_results, brute_results, "stream={:?}", stream);

    let words2 = &["ab","ba","aba"];
    let stream2 = "ababab";
    let mut sc2 = StreamChecker::new(words2);
    let t2: Vec<bool> = stream2.chars().map(|c| sc2.query(c)).collect();
    let b2 = stream_checker_brute(words2, stream2);
    assert_eq!(t2, b2, "stream2={:?}", stream2);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

struct StreamChecker { root: Node, buffer: Vec<char> }

#[derive(Default)]
struct Node { children: HashMap<char, Node>, end: bool }

impl StreamChecker {
    fn new(words: &[&str]) -> Self {
        // TODO: insert each word reversed into root
        let _ = words;
        todo!()
    }
    fn query(&mut self, letter: char) -> bool {
        // TODO: push letter, scan buffer newest-first through the trie
        let _ = letter;
        todo!()
    }
}

fn main() {
    let mut sc = StreamChecker::new(&["cd","f"]);
    assert!(!sc.query('a'));
    assert!(!sc.query('b'));
    assert!(!sc.query('c'));
    assert!(sc.query('d'));
    println!("ok");
}`,
    tags: ['trie', 'stream', 'suffix-matching'],
  },
  {
    id: 'ds-ch08-c-030',
    chapter: 8,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sum of Prefix Scores of Strings',
    prompt: `Given an array of words, for each word compute the sum over all its non-empty prefixes of
how many words in the array start with that prefix. Return the array of sums.

    fn sum_of_prefix_scores(words: &[&str]) -> Vec<i32>

Example: words = ["abc","ab","bc","b"] -> [5, 4, 3, 2].
"abc" scores: prefix "a" -> 2 words, "ab" -> 2, "abc" -> 1, total 5.
Cross-check against brute-force O(n^2 * L).`,
    hints: [
      'Build a trie where each node stores cnt: the number of words that pass through it (incremented for every insertion).',
      'For each word, walk its path in the trie and sum up the cnt values along the way.',
    ],
    solution: `use std::collections::HashMap;

fn sum_of_prefix_scores(words: &[&str]) -> Vec<i32> {
    #[derive(Default)]
    struct Node { children: HashMap<char, Node>, cnt: i32 }
    let mut root = Node::default();
    for &w in words {
        let mut node = &mut root;
        for c in w.chars() {
            node = node.children.entry(c).or_default();
            node.cnt += 1;
        }
    }
    words.iter().map(|&w| {
        let mut node = &root;
        let mut total = 0;
        for c in w.chars() {
            node = node.children.get(&c).unwrap();
            total += node.cnt;
        }
        total
    }).collect()
}

fn sum_of_prefix_scores_brute(words: &[&str]) -> Vec<i32> {
    words.iter().map(|&w| {
        let mut score = 0i32;
        for i in 1..=w.len() {
            let prefix = &w[..i];
            score += words.iter().filter(|&&other| other.starts_with(prefix)).count() as i32;
        }
        score
    }).collect()
}

fn main() {
    let tests: &[&[&str]] = &[
        &["abc","ab","bc","b"],
        &["abcd","dbab","cdba","bacd"],
        &["a"],
        &["a","b","c"],
    ];
    for &words in tests {
        let trie_ans = sum_of_prefix_scores(words);
        let brute_ans = sum_of_prefix_scores_brute(words);
        assert_eq!(trie_ans, brute_ans, "words={:?}", words);
    }
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn sum_of_prefix_scores(words: &[&str]) -> Vec<i32> {
    // TODO: trie with cnt per node; for each word sum cnt along its path
    let _ = words;
    todo!()
}

fn main() {
    let words = &["abc","ab","bc","b"];
    let r = sum_of_prefix_scores(words);
    assert_eq!(r[0], 5);
    println!("ok");
}`,
    tags: ['trie', 'prefix', 'counting', 'array'],
  },
]

export default problems
