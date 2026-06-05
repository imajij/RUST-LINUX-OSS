import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch20-c-036',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bind a TcpListener',
    prompt: `Write a function with the signature:

    fn open_listener(addr: &str) -> std::io::Result<std::net::TcpListener>

It should call TcpListener::bind on the given address and return the result directly (use the question-mark style or just return the bound listener). In main, call open_listener with "127.0.0.1:7878"; on success print "listening", and on failure print "bind failed".

Because the Playground cannot actually bind a port, your main should not panic if binding fails - it must print the right message either way.`,
    hints: [
      'TcpListener lives in std::net.',
      'TcpListener::bind returns a std::io::Result.',
      'Match on the Result in main to choose which message to print.',
    ],
    solution: `use std::net::TcpListener;

fn open_listener(addr: &str) -> std::io::Result<TcpListener> {
    let listener = TcpListener::bind(addr)?;
    Ok(listener)
}

fn main() {
    match open_listener("127.0.0.1:7878") {
        Ok(_listener) => println!("listening"),
        Err(_e) => println!("bind failed"),
    }
}`,
    starter: `use std::net::TcpListener;

fn open_listener(addr: &str) -> std::io::Result<TcpListener> {
    // TODO: bind and return the listener
    todo!()
}

fn main() {
    // TODO: call open_listener and print the right message
}`,
    tags: ['tcplistener', 'bind', 'networking'],
  },
  {
    id: 'rs-ch20-c-037',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Incoming Connections',
    prompt: `Write a function:

    fn accept_n(listener: &std::net::TcpListener, n: usize)

It should iterate over listener.incoming(), and for each successful stream print "connection established", stopping after n successful connections. Ignore (skip) any Err values without counting them.

You do not need a working server to demonstrate the logic - just write the loop correctly. In main, create the function but you may leave the actual call commented out so the Playground does not block.`,
    hints: [
      'listener.incoming() yields items of type Result<TcpStream, _>.',
      'Use a counter and break once it reaches n.',
      'A `for stream in listener.incoming()` loop is the idiomatic shape.',
    ],
    solution: `use std::net::TcpListener;

fn accept_n(listener: &TcpListener, n: usize) {
    let mut count = 0;
    for stream in listener.incoming() {
        match stream {
            Ok(_s) => {
                println!("connection established");
                count += 1;
                if count == n {
                    break;
                }
            }
            Err(_e) => continue,
        }
    }
}

fn main() {
    // To run a real server, uncomment:
    // let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    // accept_n(&listener, 3);
    println!("accept_n is defined");
}`,
    starter: `use std::net::TcpListener;

fn accept_n(listener: &TcpListener, n: usize) {
    // TODO: loop over listener.incoming(), count n successes
}

fn main() {
    println!("accept_n is defined");
}`,
    tags: ['tcplistener', 'incoming', 'loop'],
  },
  {
    id: 'rs-ch20-c-038',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Request Lines From a Reader',
    prompt: `When reading an HTTP request you wrap the stream in a BufReader and read lines until a blank line. Practice that logic against any reader.

Write a function:

    fn read_http_request<R: std::io::BufRead>(reader: R) -> Vec<String>

It must read lines from the reader (using .lines()), unwrap each line, and collect lines into a Vec<String>, stopping when it reaches an empty line (the empty line itself is NOT included).

In main, build a reader from a byte slice that contains:
GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n
and print the resulting Vec with the debug formatter.`,
    hints: [
      'BufRead is implemented for &[u8] via std::io::BufReader or directly on a slice.',
      'The .lines() iterator strips the trailing newline for you.',
      'Use take_while or an explicit loop that breaks on an empty line.',
    ],
    solution: `use std::io::{BufRead, BufReader};

fn read_http_request<R: BufRead>(reader: R) -> Vec<String> {
    let mut lines = Vec::new();
    for line in reader.lines() {
        let line = line.unwrap();
        if line.is_empty() {
            break;
        }
        lines.push(line);
    }
    lines
}

fn main() {
    let raw = b"GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n";
    let reader = BufReader::new(&raw[..]);
    let request = read_http_request(reader);
    println!("{:?}", request);
}`,
    starter: `use std::io::{BufRead, BufReader};

fn read_http_request<R: BufRead>(reader: R) -> Vec<String> {
    // TODO: collect lines until an empty one
    todo!()
}

fn main() {
    let raw = b"GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n";
    let reader = BufReader::new(&raw[..]);
    println!("{:?}", read_http_request(reader));
}`,
    tags: ['bufreader', 'http', 'lines'],
  },
  {
    id: 'rs-ch20-c-039',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Extract the Request Line',
    prompt: `The first line of an HTTP request is the "request line", for example "GET /index.html HTTP/1.1".

Write a function:

    fn request_line(request: &[String]) -> Option<&str>

It returns Some with the first line of the request slice, or None if the slice is empty.

In main, build a Vec<String> with the two lines "GET / HTTP/1.1" and "Host: localhost", call request_line, and print the request line (or "no request" if None).`,
    hints: [
      'request.first() returns Option<&String>.',
      'Use .map to turn &String into &str with .as_str().',
    ],
    solution: `fn request_line(request: &[String]) -> Option<&str> {
    request.first().map(|s| s.as_str())
}

fn main() {
    let request = vec![
        String::from("GET / HTTP/1.1"),
        String::from("Host: localhost"),
    ];
    match request_line(&request) {
        Some(line) => println!("{}", line),
        None => println!("no request"),
    }
}`,
    starter: `fn request_line(request: &[String]) -> Option<&str> {
    // TODO: return the first line, if any
    todo!()
}

fn main() {
    let request = vec![
        String::from("GET / HTTP/1.1"),
        String::from("Host: localhost"),
    ];
    println!("{:?}", request_line(&request));
}`,
    tags: ['http', 'request-line', 'option'],
  },
  {
    id: 'rs-ch20-c-040',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Parse Method, Path, and Version',
    prompt: `Split a request line into its three parts.

Write a function:

    fn parse_request_line(line: &str) -> Option<(String, String, String)>

It splits the line on single spaces. If there are exactly three parts, return Some of (method, path, version) as owned Strings; otherwise return None.

In main, call it with "GET /about HTTP/1.1" and print the tuple with debug formatting, then call it with the malformed "JUST_TWO PARTS" and print whatever it returns.`,
    hints: [
      'Splitting on a single space yields an iterator of &str pieces.',
      'Collect into a Vec<&str> and check that its length is exactly 3.',
      'Convert each &str to String with .to_string().',
    ],
    solution: `fn parse_request_line(line: &str) -> Option<(String, String, String)> {
    let parts: Vec<&str> = line.split(' ').collect();
    if parts.len() == 3 {
        Some((
            parts[0].to_string(),
            parts[1].to_string(),
            parts[2].to_string(),
        ))
    } else {
        None
    }
}

fn main() {
    println!("{:?}", parse_request_line("GET /about HTTP/1.1"));
    println!("{:?}", parse_request_line("JUST_TWO PARTS"));
}`,
    starter: `fn parse_request_line(line: &str) -> Option<(String, String, String)> {
    // TODO: split on spaces; only accept exactly three parts
    todo!()
}

fn main() {
    println!("{:?}", parse_request_line("GET /about HTTP/1.1"));
    println!("{:?}", parse_request_line("JUST_TWO PARTS"));
}`,
    tags: ['http', 'parsing', 'split'],
  },
  {
    id: 'rs-ch20-c-041',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build a 200 OK Status Line',
    prompt: `Write a function:

    fn status_line(code: u16, reason: &str) -> String

It returns an HTTP/1.1 status line of the form "HTTP/1.1 {code} {reason}" - for example, given 200 and "OK" it returns the string "HTTP/1.1 200 OK" (with no trailing newline).

In main, print the result for (200, "OK"), (404, "NOT FOUND"), and (500, "INTERNAL SERVER ERROR").`,
    hints: [
      'Use format! with the version, code, and reason.',
      'No CRLF is needed for this exercise - just the text.',
    ],
    solution: `fn status_line(code: u16, reason: &str) -> String {
    format!("HTTP/1.1 {} {}", code, reason)
}

fn main() {
    println!("{}", status_line(200, "OK"));
    println!("{}", status_line(404, "NOT FOUND"));
    println!("{}", status_line(500, "INTERNAL SERVER ERROR"));
}`,
    starter: `fn status_line(code: u16, reason: &str) -> String {
    // TODO: format the status line
    todo!()
}

fn main() {
    println!("{}", status_line(200, "OK"));
}`,
    tags: ['http', 'response', 'format'],
  },
  {
    id: 'rs-ch20-c-042',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Assemble a Full HTTP Response',
    prompt: `A complete HTTP response is a status line, a Content-Length header, a blank line, and the body, each separated by CRLF.

Write a function:

    fn build_response(status: &str, body: &str) -> String

It returns a string of the exact form:
"{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}"
where {len} is the byte length of the body.

In main, call build_response with "HTTP/1.1 200 OK" and the body "hello", and print the result with the debug formatter so the CRLFs are visible.`,
    hints: [
      'body.len() gives the byte length needed for Content-Length.',
      'Use format! with explicit \\\\r\\\\n separators.',
      'Printing with {:?} shows the escape sequences.',
    ],
    solution: `fn build_response(status: &str, body: &str) -> String {
    let length = body.len();
    format!(
        "{}\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
        status, length, body
    )
}

fn main() {
    let response = build_response("HTTP/1.1 200 OK", "hello");
    println!("{:?}", response);
}`,
    starter: `fn build_response(status: &str, body: &str) -> String {
    // TODO: status line + Content-Length + blank line + body
    todo!()
}

fn main() {
    println!("{:?}", build_response("HTTP/1.1 200 OK", "hello"));
}`,
    tags: ['http', 'response', 'content-length'],
  },
  {
    id: 'rs-ch20-c-043',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write a Response Into a Writer',
    prompt: `Real servers call write_all on a TcpStream. Practice the same logic with any writer.

Write a function:

    fn send_response<W: std::io::Write>(writer: &mut W, response: &str) -> std::io::Result<()>

It writes the response bytes to the writer using write_all (use response.as_bytes()).

In main, use a Vec<u8> as the writer, send the response "HTTP/1.1 200 OK\\r\\n\\r\\nhi", then convert the Vec<u8> back to a String and print it with debug formatting.`,
    hints: [
      'Write is in std::io and Vec<u8> implements it.',
      'write_all takes a &[u8].',
      'String::from_utf8(buf).unwrap() turns the bytes back into text.',
    ],
    solution: `use std::io::Write;

fn send_response<W: Write>(writer: &mut W, response: &str) -> std::io::Result<()> {
    writer.write_all(response.as_bytes())?;
    Ok(())
}

fn main() {
    let mut buf: Vec<u8> = Vec::new();
    send_response(&mut buf, "HTTP/1.1 200 OK\\r\\n\\r\\nhi").unwrap();
    let text = String::from_utf8(buf).unwrap();
    println!("{:?}", text);
}`,
    starter: `use std::io::Write;

fn send_response<W: Write>(writer: &mut W, response: &str) -> std::io::Result<()> {
    // TODO: write_all the response bytes
    todo!()
}

fn main() {
    let mut buf: Vec<u8> = Vec::new();
    send_response(&mut buf, "HTTP/1.1 200 OK\\r\\n\\r\\nhi").unwrap();
    println!("{:?}", String::from_utf8(buf).unwrap());
}`,
    tags: ['http', 'write', 'generics'],
  },
  {
    id: 'rs-ch20-c-044',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Route by Request Line',
    prompt: `The server picks content based on the request line. Write a function:

    fn route(request_line: &str) -> (&'static str, &'static str)

It returns a tuple of (status_line, filename):
- if request_line equals "GET / HTTP/1.1", return ("HTTP/1.1 200 OK", "hello.html")
- otherwise, return ("HTTP/1.1 404 NOT FOUND", "404.html")

In main, print the result for the root request and for "GET /missing HTTP/1.1".`,
    hints: [
      'A simple if/else comparing request_line works.',
      'Both arms must return the same tuple type of two &static str.',
    ],
    solution: `fn route(request_line: &str) -> (&'static str, &'static str) {
    if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "hello.html")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "404.html")
    }
}

fn main() {
    println!("{:?}", route("GET / HTTP/1.1"));
    println!("{:?}", route("GET /missing HTTP/1.1"));
}`,
    starter: `fn route(request_line: &str) -> (&'static str, &'static str) {
    // TODO: match the root path or fall back to 404
    todo!()
}

fn main() {
    println!("{:?}", route("GET / HTTP/1.1"));
    println!("{:?}", route("GET /missing HTTP/1.1"));
}`,
    tags: ['http', 'routing', '404'],
  },
  {
    id: 'rs-ch20-c-045',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Serve Multiple Routes',
    prompt: `Extend routing to several paths. Write a function:

    fn handle(request_line: &str) -> (u16, String)

Return a tuple of (status_code, body):
- "GET / HTTP/1.1" returns (200, "home")
- "GET /about HTTP/1.1" returns (200, "about page")
- "GET /contact HTTP/1.1" returns (200, "contact us")
- anything else returns (404, "not found")

In main, call handle for each of the four cases above and print every result with debug formatting.`,
    hints: [
      'Use a match on request_line.',
      'The body must be an owned String, so use .to_string() on each literal.',
    ],
    solution: `fn handle(request_line: &str) -> (u16, String) {
    match request_line {
        "GET / HTTP/1.1" => (200, "home".to_string()),
        "GET /about HTTP/1.1" => (200, "about page".to_string()),
        "GET /contact HTTP/1.1" => (200, "contact us".to_string()),
        _ => (404, "not found".to_string()),
    }
}

fn main() {
    println!("{:?}", handle("GET / HTTP/1.1"));
    println!("{:?}", handle("GET /about HTTP/1.1"));
    println!("{:?}", handle("GET /contact HTTP/1.1"));
    println!("{:?}", handle("GET /xyz HTTP/1.1"));
}`,
    starter: `fn handle(request_line: &str) -> (u16, String) {
    // TODO: match on the route, fall back to 404
    todo!()
}

fn main() {
    println!("{:?}", handle("GET /about HTTP/1.1"));
}`,
    tags: ['http', 'routing', 'match'],
  },
  {
    id: 'rs-ch20-c-046',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read an HTML File Into a Body',
    prompt: `The server reads an HTML file from disk to use as the body. Since the Playground has a writable temp dir, demonstrate the full read.

Write a function:

    fn load_body(path: &str) -> std::io::Result<String>

It uses std::fs::read_to_string to load the file and returns the result.

In main: write the text "<h1>Hi</h1>" to a temp file with std::fs::write (use a path under std::env::temp_dir()), call load_body on it, and print the loaded contents.`,
    hints: [
      'std::fs::read_to_string returns Result<String, io::Error>.',
      'Build a path by joining std::env::temp_dir() with a filename.',
      'temp_dir().join("page.html") gives a PathBuf you can pass with to_str or directly.',
    ],
    solution: `use std::fs;

fn load_body(path: &str) -> std::io::Result<String> {
    fs::read_to_string(path)
}

fn main() {
    let dir = std::env::temp_dir();
    let path = dir.join("page.html");
    let path_str = path.to_str().unwrap();

    fs::write(path_str, "<h1>Hi</h1>").unwrap();

    match load_body(path_str) {
        Ok(body) => println!("{}", body),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `use std::fs;

fn load_body(path: &str) -> std::io::Result<String> {
    // TODO: read the file to a String
    todo!()
}

fn main() {
    let path = std::env::temp_dir().join("page.html");
    let path_str = path.to_str().unwrap();
    fs::write(path_str, "<h1>Hi</h1>").unwrap();
    println!("{:?}", load_body(path_str));
}`,
    tags: ['fs', 'http', 'file-serving'],
  },
  {
    id: 'rs-ch20-c-047',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compose Route and Response',
    prompt: `Combine routing and response building. Write a function:

    fn respond(request_line: &str) -> String

For the request "GET / HTTP/1.1" the status is "HTTP/1.1 200 OK" and the body is "welcome"; for everything else the status is "HTTP/1.1 404 NOT FOUND" and the body is "missing". The function returns the full response in the form:
"{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}"

In main, print respond("GET / HTTP/1.1") and respond("GET /nope HTTP/1.1") with debug formatting.`,
    hints: [
      'Pick (status, body) with an if/else, then format the response.',
      'Content-Length is body.len().',
    ],
    solution: `fn respond(request_line: &str) -> String {
    let (status, body) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "welcome")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "missing")
    };

    format!(
        "{}\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
        status,
        body.len(),
        body
    )
}

fn main() {
    println!("{:?}", respond("GET / HTTP/1.1"));
    println!("{:?}", respond("GET /nope HTTP/1.1"));
}`,
    starter: `fn respond(request_line: &str) -> String {
    // TODO: choose status+body, then build the full response
    todo!()
}

fn main() {
    println!("{:?}", respond("GET / HTTP/1.1"));
}`,
    tags: ['http', 'response', 'routing'],
  },
  {
    id: 'rs-ch20-c-048',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Store Boxed FnOnce Jobs',
    prompt: `A thread pool stores jobs as boxed closures. The type alias used in the book is:

    type Job = Box<dyn FnOnce() + Send + 'static>;

Write a function:

    fn make_jobs() -> Vec<Job>

It returns a vector of three boxed closures: the first prints "job 1", the second prints "job 2", the third prints "job 3".

In main, call make_jobs, then iterate the vector and call each job (each Box<dyn FnOnce()> can be called directly).`,
    hints: [
      'Box::new(|| { ... }) creates one job; push three of them.',
      'A Box<dyn FnOnce()> can be invoked by calling it like a function.',
      'Iterate with `for job in jobs` since calling FnOnce consumes it.',
    ],
    solution: `type Job = Box<dyn FnOnce() + Send + 'static>;

fn make_jobs() -> Vec<Job> {
    let mut jobs: Vec<Job> = Vec::new();
    jobs.push(Box::new(|| println!("job 1")));
    jobs.push(Box::new(|| println!("job 2")));
    jobs.push(Box::new(|| println!("job 3")));
    jobs
}

fn main() {
    let jobs = make_jobs();
    for job in jobs {
        job();
    }
}`,
    starter: `type Job = Box<dyn FnOnce() + Send + 'static>;

fn make_jobs() -> Vec<Job> {
    // TODO: build three boxed closures
    todo!()
}

fn main() {
    for job in make_jobs() {
        job();
    }
}`,
    tags: ['threadpool', 'fnonce', 'box'],
  },
  {
    id: 'rs-ch20-c-049',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Job Type That Runs Once',
    prompt: `Demonstrate why jobs are FnOnce and not Fn. Write a function:

    fn run_once(job: Box<dyn FnOnce()>)

It calls the job exactly once.

In main, create a String named greeting equal to "hi". Build a boxed closure that MOVES greeting in and prints it, then pass that closure to run_once. The closure must take ownership of greeting (use the move keyword) so it can consume the String - which is exactly why FnOnce is required.`,
    hints: [
      'A closure that moves a String and prints it can only run once safely.',
      'Use Box::new(move || ...).',
      'run_once just calls job().',
    ],
    solution: `fn run_once(job: Box<dyn FnOnce()>) {
    job();
}

fn main() {
    let greeting = String::from("hi");
    let job: Box<dyn FnOnce()> = Box::new(move || {
        println!("{}", greeting);
    });
    run_once(job);
}`,
    starter: `fn run_once(job: Box<dyn FnOnce()>) {
    // TODO: call the job once
}

fn main() {
    let greeting = String::from("hi");
    // TODO: box a move closure and pass it to run_once
}`,
    tags: ['fnonce', 'move', 'closures'],
  },
  {
    id: 'rs-ch20-c-050',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Send Jobs Through a Channel',
    prompt: `A thread pool dispatches jobs over an mpsc channel. Write a program in main that:

1. Creates a channel where the value type is Box<dyn FnOnce() + Send + 'static>.
2. Spawns one worker thread that loops, receiving jobs from the channel and calling each one, until the channel is closed (recv returns Err).
3. From main, sends two jobs: one prints "first", one prints "second".
4. Drops the sender so the worker's recv loop ends, then joins the worker.

The expected output is the two lines "first" and "second".`,
    hints: [
      'Use std::sync::mpsc::channel and std::thread.',
      'In the worker, `while let Ok(job) = receiver.recv() { job(); }` ends when the sender is dropped.',
      'Call drop(sender) before joining, or let it go out of scope.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();

    let worker = thread::spawn(move || {
        while let Ok(job) = receiver.recv() {
            job();
        }
    });

    sender.send(Box::new(|| println!("first"))).unwrap();
    sender.send(Box::new(|| println!("second"))).unwrap();

    drop(sender);
    worker.join().unwrap();
}`,
    starter: `use std::sync::mpsc;
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();
    // TODO: spawn a worker that runs jobs, send two jobs, drop sender, join
}`,
    tags: ['channel', 'threadpool', 'jobs'],
  },
  {
    id: 'rs-ch20-c-051',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Share a Receiver With Arc and Mutex',
    prompt: `Multiple workers must share one receiving end of a channel, which requires Arc<Mutex<Receiver<Job>>>.

Write a program in main that:
1. Creates a channel of Box<dyn FnOnce() + Send + 'static>.
2. Wraps the receiver in Arc::new(Mutex::new(receiver)).
3. Clones the Arc and spawns ONE worker that loops: lock the mutex, recv a job, release the lock, then run the job - ending when recv returns Err.
4. Sends one job that prints "shared", drops the sender, and joins the worker.

Make sure the lock is released before running the job (do not hold the lock while the job runs).`,
    hints: [
      'Use std::sync::{Arc, Mutex, mpsc}.',
      'receiver.lock().unwrap().recv() returns the next job; bind it on its own line so the guard drops.',
      'Clone the Arc before moving it into the spawned thread.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(receiver));

    let recv = Arc::clone(&receiver);
    let worker = thread::spawn(move || loop {
        let message = recv.lock().unwrap().recv();
        match message {
            Ok(job) => job(),
            Err(_) => break,
        }
    });

    sender.send(Box::new(|| println!("shared"))).unwrap();
    drop(sender);
    worker.join().unwrap();
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(receiver));
    // TODO: spawn a worker sharing the receiver, send a job, drop, join
}`,
    tags: ['arc', 'mutex', 'channel'],
  },
  {
    id: 'rs-ch20-c-052',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Worker Struct',
    prompt: `Define the Worker type used by a thread pool. Each worker has an id and owns a join handle.

Define:

    struct Worker {
        id: usize,
        thread: std::thread::JoinHandle<()>,
    }

Give Worker an associated function:

    fn new(id: usize) -> Worker

It spawns a thread that prints "worker {id} started" (with the actual id) and stores the handle.

In main, create three workers with ids 0, 1, 2, then join each worker's thread so all messages print before the program exits.`,
    hints: [
      'thread::spawn returns a JoinHandle you store in the struct.',
      'The closure must capture id; print inside it.',
      'Join with worker.thread.join().unwrap() (the field is public within the module).',
    ],
    solution: `use std::thread;

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        let thread = thread::spawn(move || {
            println!("worker {} started", id);
        });
        Worker { id, thread }
    }
}

fn main() {
    let mut workers = Vec::new();
    for id in 0..3 {
        workers.push(Worker::new(id));
    }
    for worker in workers {
        worker.thread.join().unwrap();
    }
}`,
    starter: `use std::thread;

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        // TODO: spawn a thread that prints a start message
        todo!()
    }
}

fn main() {
    // TODO: create three workers and join them
}`,
    tags: ['worker', 'threads', 'struct'],
  },
  {
    id: 'rs-ch20-c-053',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Worker That Pulls Jobs',
    prompt: `Build a Worker whose thread loops pulling jobs from a shared receiver.

Define:

    struct Worker { id: usize, thread: std::thread::JoinHandle<()> }

with:

    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker

The spawned thread loops: lock, recv, and on Ok run the job; on Err print "worker {id} disconnected" and break.

In main, create a channel, wrap the receiver in Arc<Mutex<_>>, build one Worker with id 0, send a job that prints "task done", drop the sender, and join the worker. Expect "task done" then "worker 0 disconnected".`,
    hints: [
      'Define type Job as a boxed FnOnce that is Send with a static lifetime.',
      'Lock, recv, then match; release the guard before running the job.',
      'Dropping the sender makes recv return Err, ending the loop.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => {
                    println!("worker {} disconnected", id);
                    break;
                }
            }
        });
        Worker { id, thread }
    }
}

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(receiver));

    let worker = Worker::new(0, Arc::clone(&receiver));

    sender.send(Box::new(|| println!("task done"))).unwrap();
    drop(sender);
    worker.thread.join().unwrap();
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        // TODO: spawn a thread that pulls and runs jobs
        todo!()
    }
}

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(receiver));
    // TODO: build a worker, send a job, drop sender, join
}`,
    tags: ['worker', 'channel', 'arc'],
  },
  {
    id: 'rs-ch20-c-054',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'ThreadPool::new With Capacity',
    prompt: `Design the start of a ThreadPool API. Define:

    struct ThreadPool { size: usize }

with:

    fn new(size: usize) -> ThreadPool

The function must assert that size is greater than zero (use assert!), then store the size. The assertion documents that a pool of zero threads makes no sense.

In main, create a pool with ThreadPool::new(4) and print "pool of {size} threads". (Do not call new with 0 - that would panic, which is the intended behavior.)`,
    hints: [
      'assert!(size > 0) panics with a message if the size is zero.',
      'Store size in the struct and read it back in main.',
    ],
    solution: `struct ThreadPool {
    size: usize,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        ThreadPool { size }
    }
}

fn main() {
    let pool = ThreadPool::new(4);
    println!("pool of {} threads", pool.size);
}`,
    starter: `struct ThreadPool {
    size: usize,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        // TODO: assert size > 0, then store it
        todo!()
    }
}

fn main() {
    let pool = ThreadPool::new(4);
    println!("pool of {} threads", pool.size);
}`,
    tags: ['threadpool', 'new', 'assert'],
  },
  {
    id: 'rs-ch20-c-055',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'ThreadPool With Worker Vec',
    prompt: `Extend ThreadPool to hold its workers. Use these definitions:

    struct ThreadPool { workers: Vec<Worker> }
    struct Worker { id: usize, thread: std::thread::JoinHandle<()> }

ThreadPool::new(size) must create size workers (ids 0..size) and store them. Worker::new(id) spawns a thread that prints "worker {id} ready".

In main, create a pool of 3 workers, then join every worker's thread (you may consume the pool's workers field) so all "ready" messages print.`,
    hints: [
      'Use Vec::with_capacity(size) and a loop pushing Worker::new(id).',
      'Worker::new spawns a thread and stores the handle.',
      'To join, iterate over the pool.workers vector.',
    ],
    solution: `use std::thread;

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        let thread = thread::spawn(move || {
            println!("worker {} ready", id);
        });
        Worker { id, thread }
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id));
        }
        ThreadPool { workers }
    }
}

fn main() {
    let pool = ThreadPool::new(3);
    for worker in pool.workers {
        worker.thread.join().unwrap();
    }
}`,
    starter: `use std::thread;

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        // TODO
        todo!()
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        // TODO: build size workers
        todo!()
    }
}

fn main() {
    let pool = ThreadPool::new(3);
    for worker in pool.workers {
        worker.thread.join().unwrap();
    }
}`,
    tags: ['threadpool', 'worker', 'vec'],
  },
  {
    id: 'rs-ch20-c-056',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'The execute Signature',
    prompt: `The execute method accepts any closure that can run as a job. Its signature from the book is:

    fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static

For this exercise, implement a ThreadPool that owns an mpsc::Sender<Job> and whose execute boxes the closure and sends it through the channel. Define a single Worker that runs jobs in a loop.

In main, build a pool of size 1, call execute twice with closures that print "a" and "b", then drop the pool's sender and join the worker. Expect "a" then "b".`,
    hints: [
      'Box::new(f) turns F into a Job; then sender.send(job).unwrap().',
      'Store the sender as Option<Sender<Job>> or plain Sender<Job> if you drop it explicitly.',
      'The bounds FnOnce plus Send plus a static lifetime let the job move to and run on another thread.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        });
        Worker { thread }
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);
        for _ in 0..size {
            workers.push(Worker::new(Arc::clone(&receiver)));
        }
        ThreadPool { workers, sender: Some(sender) }
    }

    fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.as_ref().unwrap().send(job).unwrap();
    }
}

fn main() {
    let mut pool = ThreadPool::new(1);
    pool.execute(|| println!("a"));
    pool.execute(|| println!("b"));

    pool.sender.take();
    for worker in pool.workers {
        worker.thread.join().unwrap();
    }
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker { thread: thread::JoinHandle<()> }
struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> }

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        todo!()
    }
    fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        // TODO: box f and send it
        todo!()
    }
}

fn main() {
    // TODO
}`,
    tags: ['execute', 'threadpool', 'generics'],
  },
  {
    id: 'rs-ch20-c-057',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Completed Jobs',
    prompt: `Use a thread pool to run jobs and count completions with an Arc<Mutex<usize>> counter.

In main:
1. Build a counter as Arc<Mutex<usize>> initialized to 0.
2. Create a channel of Box<dyn FnOnce() + Send + 'static> and spawn 2 worker threads sharing the receiver.
3. Send 6 jobs; each job locks the counter and increments it by 1.
4. Drop the sender, join both workers, then print the final counter value (it must be 6).`,
    hints: [
      'Clone the counter Arc into each job closure with a move closure.',
      '*counter.lock().unwrap() += 1 increments the shared count.',
      'Join all workers before reading the final value.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let counter = Arc::new(Mutex::new(0usize));
    let (sender, receiver) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(receiver));

    let mut workers = Vec::new();
    for _ in 0..2 {
        let recv = Arc::clone(&receiver);
        workers.push(thread::spawn(move || loop {
            let message = recv.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        }));
    }

    for _ in 0..6 {
        let c = Arc::clone(&counter);
        sender
            .send(Box::new(move || {
                *c.lock().unwrap() += 1;
            }))
            .unwrap();
    }

    drop(sender);
    for w in workers {
        w.join().unwrap();
    }

    println!("{}", *counter.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let counter = Arc::new(Mutex::new(0usize));
    // TODO: 2 workers, 6 jobs incrementing the counter, then print it
}`,
    tags: ['threadpool', 'arc', 'mutex'],
  },
  {
    id: 'rs-ch20-c-058',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Collect Results From Jobs',
    prompt: `Run jobs that compute values and send each result back over a second channel.

In main:
1. Create a jobs channel of Box<dyn FnOnce() + Send + 'static> and spawn 2 workers sharing its receiver.
2. Create a results channel of i32.
3. For n in 1..=4, send a job that computes n * n and sends the square to the results channel (clone the results Sender into each job).
4. After sending the four jobs, drop the jobs sender so workers finish; join the workers.
5. Drop your results Sender, then collect all results into a Vec, sort it, and print it. Expect [1, 4, 9, 16].`,
    hints: [
      'Move a clone of the results Sender into each job closure.',
      'After joining workers all results have been sent; drop the original results Sender too.',
      'Collect with result_rx.iter().collect::<Vec<i32>>(), then sort.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (job_tx, job_rx) = mpsc::channel::<Job>();
    let job_rx = Arc::new(Mutex::new(job_rx));
    let (res_tx, res_rx) = mpsc::channel::<i32>();

    let mut workers = Vec::new();
    for _ in 0..2 {
        let recv = Arc::clone(&job_rx);
        workers.push(thread::spawn(move || loop {
            let message = recv.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        }));
    }

    for n in 1..=4 {
        let tx = res_tx.clone();
        job_tx
            .send(Box::new(move || {
                tx.send(n * n).unwrap();
            }))
            .unwrap();
    }

    drop(job_tx);
    for w in workers {
        w.join().unwrap();
    }

    drop(res_tx);
    let mut results: Vec<i32> = res_rx.iter().collect();
    results.sort();
    println!("{:?}", results);
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    // TODO: 2 workers, jobs that send n*n on a results channel, collect & sort
}`,
    tags: ['threadpool', 'channel', 'results'],
  },
  {
    id: 'rs-ch20-c-059',
    chapter: 20,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sleep Route Simulation',
    prompt: `The book adds a "/sleep" route that blocks one thread to show the value of concurrency. Simulate the routing decision (without an actual server).

Write a function:

    fn route_action(request_line: &str) -> (&'static str, u64)

It returns (body, sleep_seconds):
- "GET / HTTP/1.1" returns ("hello", 0)
- "GET /sleep HTTP/1.1" returns ("slept", 5)
- anything else returns ("not found", 0)

In main, print the result for each of the three cases above with debug formatting.`,
    hints: [
      'A match on request_line returns one of three tuples.',
      'You are only deciding values here, not actually sleeping.',
    ],
    solution: `fn route_action(request_line: &str) -> (&'static str, u64) {
    match request_line {
        "GET / HTTP/1.1" => ("hello", 0),
        "GET /sleep HTTP/1.1" => ("slept", 5),
        _ => ("not found", 0),
    }
}

fn main() {
    println!("{:?}", route_action("GET / HTTP/1.1"));
    println!("{:?}", route_action("GET /sleep HTTP/1.1"));
    println!("{:?}", route_action("GET /x HTTP/1.1"));
}`,
    starter: `fn route_action(request_line: &str) -> (&'static str, u64) {
    // TODO: map each route to (body, sleep_seconds)
    todo!()
}

fn main() {
    println!("{:?}", route_action("GET /sleep HTTP/1.1"));
}`,
    tags: ['http', 'routing', 'sleep'],
  },
  {
    id: 'rs-ch20-c-060',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Graceful Shutdown With Drop',
    prompt: `Implement graceful shutdown the way the book does: when the pool is dropped, drop the sender to signal workers to stop, then join each worker's thread.

Use these types:

    struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> }
    struct Worker { id: usize, thread: Option<thread::JoinHandle<()>> }

Implement Drop for ThreadPool: take and drop the sender, then for each worker take its thread Option and join it, printing "shutting down worker {id}" before joining.

In main, create a pool of 2, execute two jobs that print "work", and let the pool go out of scope so Drop runs. The two shutdown messages must appear.`,
    hints: [
      'Wrap the thread in Option so Drop can take() it out and join it.',
      'In Drop, self.sender.take() drops the sender and ends the recv loops.',
      'if let Some(thread) = worker.thread.take() { thread.join().unwrap(); }',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        });
        Worker { id, thread: Some(thread) }
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }
        ThreadPool { workers, sender: Some(sender) }
    }

    fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        self.sender.as_ref().unwrap().send(Box::new(f)).unwrap();
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        drop(self.sender.take());
        for worker in &mut self.workers {
            println!("shutting down worker {}", worker.id);
            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
        }
    }
}

fn main() {
    let pool = ThreadPool::new(2);
    pool.execute(|| println!("work"));
    pool.execute(|| println!("work"));
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker { id: usize, thread: Option<thread::JoinHandle<()>> }
struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> }

impl Drop for ThreadPool {
    fn drop(&mut self) {
        // TODO: drop sender, then join each worker thread
    }
}

fn main() {
    // TODO
}`,
    tags: ['drop', 'shutdown', 'threadpool'],
  },
  {
    id: 'rs-ch20-c-061',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Why Option Around the Join Handle',
    prompt: `Demonstrate the exact reason JoinHandle is stored inside an Option. join() consumes the handle by value, but Drop only gives you &mut self, so you cannot move the handle out of a struct field directly.

Define:

    struct Task { name: String, handle: Option<std::thread::JoinHandle<()>> }

Give it:
- fn new(name: &str) -> Task that spawns a thread printing "running {name}" and stores Some(handle).
- An implementation of Drop that uses self.handle.take() to move the handle out, then joins it, printing "joined {name}".

In main, create a Task named "t1" inside an inner scope so it is dropped at the end of that scope, then print "after scope".`,
    hints: [
      'Option::take() replaces the field with None and returns the old value by ownership.',
      'You cannot write self.handle.join() because that needs ownership of the field.',
      'Use `if let Some(h) = self.handle.take()` inside Drop.',
    ],
    solution: `use std::thread;

struct Task {
    name: String,
    handle: Option<thread::JoinHandle<()>>,
}

impl Task {
    fn new(name: &str) -> Task {
        let owned = name.to_string();
        let label = owned.clone();
        let handle = thread::spawn(move || {
            println!("running {}", label);
        });
        Task { name: owned, handle: Some(handle) }
    }
}

impl Drop for Task {
    fn drop(&mut self) {
        if let Some(h) = self.handle.take() {
            h.join().unwrap();
            println!("joined {}", self.name);
        }
    }
}

fn main() {
    {
        let _t = Task::new("t1");
    }
    println!("after scope");
}`,
    starter: `use std::thread;

struct Task {
    name: String,
    handle: Option<thread::JoinHandle<()>>,
}

impl Task {
    fn new(name: &str) -> Task {
        // TODO: spawn a thread, store Some(handle)
        todo!()
    }
}

impl Drop for Task {
    fn drop(&mut self) {
        // TODO: take() the handle and join it
    }
}

fn main() {
    {
        let _t = Task::new("t1");
    }
    println!("after scope");
}`,
    tags: ['drop', 'option', 'join'],
  },
  {
    id: 'rs-ch20-c-062',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Worker Loop With while let',
    prompt: `Compare two loop shapes. The book notes that using "while let Ok(job) = receiver.lock().unwrap().recv()" holds the lock for too long (until the job finishes), while a "let job = ...; match" releases the lock immediately.

Write TWO worker-building functions that both take Arc<Mutex<mpsc::Receiver<Job>>>:

    fn worker_loop_good(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> thread::JoinHandle<()>
    fn worker_loop_bad(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> thread::JoinHandle<()>

The "good" one binds the lock+recv result on its own statement so the guard drops before the job runs. The "bad" one uses while let, holding the lock across job execution.

In main, use only worker_loop_good: create a channel, spawn one good worker, send two jobs printing "g1" and "g2", drop the sender, and join. Both functions must compile.`,
    hints: [
      'In good: `let message = receiver.lock().unwrap().recv();` then match on it.',
      'In bad: `while let Ok(job) = receiver.lock().unwrap().recv() { job(); }`.',
      'Both return the JoinHandle from thread::spawn.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn worker_loop_good(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> thread::JoinHandle<()> {
    thread::spawn(move || loop {
        let message = receiver.lock().unwrap().recv();
        match message {
            Ok(job) => job(),
            Err(_) => break,
        }
    })
}

fn worker_loop_bad(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> thread::JoinHandle<()> {
    thread::spawn(move || {
        while let Ok(job) = receiver.lock().unwrap().recv() {
            job();
        }
    })
}

fn main() {
    let (sender, receiver) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(receiver));

    let handle = worker_loop_good(Arc::clone(&receiver));

    sender.send(Box::new(|| println!("g1"))).unwrap();
    sender.send(Box::new(|| println!("g2"))).unwrap();

    drop(sender);
    handle.join().unwrap();
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn worker_loop_good(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> thread::JoinHandle<()> {
    // TODO: bind lock+recv, then match
    todo!()
}

fn worker_loop_bad(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> thread::JoinHandle<()> {
    // TODO: while let holding the lock across the job
    todo!()
}

fn main() {
    // TODO: use worker_loop_good
}`,
    tags: ['mutex', 'while-let', 'locking'],
  },
  {
    id: 'rs-ch20-c-063',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Bounded Pool: Reject When Full',
    prompt: `Build a tiny pool that tracks how many jobs it has accepted and refuses more than its capacity.

Define:

    struct BoundedPool { capacity: usize, accepted: usize }

with:
- fn new(capacity: usize) -> BoundedPool
- fn try_execute<F: FnOnce() + Send + 'static>(&mut self, f: F) -> bool

try_execute returns false if accepted has reached capacity (and does NOT run f); otherwise it increments accepted, runs f immediately, and returns true.

In main, create a pool with capacity 2, then call try_execute three times with closures printing "task". Print the boolean returned each time. Expect true, true, false (and "task" printed twice).`,
    hints: [
      'Compare self.accepted to self.capacity before running.',
      'Run the closure by calling f() once it is accepted.',
      'Return the bool indicating acceptance.',
    ],
    solution: `struct BoundedPool {
    capacity: usize,
    accepted: usize,
}

impl BoundedPool {
    fn new(capacity: usize) -> BoundedPool {
        BoundedPool { capacity, accepted: 0 }
    }

    fn try_execute<F: FnOnce() + Send + 'static>(&mut self, f: F) -> bool {
        if self.accepted >= self.capacity {
            return false;
        }
        self.accepted += 1;
        f();
        true
    }
}

fn main() {
    let mut pool = BoundedPool::new(2);
    println!("{}", pool.try_execute(|| println!("task")));
    println!("{}", pool.try_execute(|| println!("task")));
    println!("{}", pool.try_execute(|| println!("task")));
}`,
    starter: `struct BoundedPool {
    capacity: usize,
    accepted: usize,
}

impl BoundedPool {
    fn new(capacity: usize) -> BoundedPool {
        BoundedPool { capacity, accepted: 0 }
    }

    fn try_execute<F: FnOnce() + Send + 'static>(&mut self, f: F) -> bool {
        // TODO: reject if full, else run f and accept
        todo!()
    }
}

fn main() {
    let mut pool = BoundedPool::new(2);
    println!("{}", pool.try_execute(|| println!("task")));
}`,
    tags: ['threadpool', 'capacity', 'fnonce'],
  },
  {
    id: 'rs-ch20-c-064',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pool That Processes a Fixed Count',
    prompt: `The book limits the demo server to a few requests using take(2) on the incoming iterator. Simulate that with an in-memory queue of request lines processed by a thread pool.

In main:
1. Build a channel of Box<dyn FnOnce() + Send + 'static> and spawn 3 workers sharing the receiver.
2. Create a results channel of String.
3. You have the request lines: "GET / HTTP/1.1", "GET /about HTTP/1.1", "GET /missing HTTP/1.1". For each, send a job that computes the body (root -> "home", about -> "about", anything else -> "404") and sends "{request_line} => {body}" to the results channel.
4. Drop the jobs sender, join the workers, drop the results sender, collect the results into a Vec, sort, and print each line.`,
    hints: [
      'Move the request line (as an owned String) and a results Sender clone into each job.',
      'Decide the body inside the job with a match on the owned line.',
      'Collect with res_rx.iter().collect(), then sort the Vec<String>.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn body_for(line: &str) -> &'static str {
    match line {
        "GET / HTTP/1.1" => "home",
        "GET /about HTTP/1.1" => "about",
        _ => "404",
    }
}

fn main() {
    let (job_tx, job_rx) = mpsc::channel::<Job>();
    let job_rx = Arc::new(Mutex::new(job_rx));
    let (res_tx, res_rx) = mpsc::channel::<String>();

    let mut workers = Vec::new();
    for _ in 0..3 {
        let recv = Arc::clone(&job_rx);
        workers.push(thread::spawn(move || loop {
            let message = recv.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        }));
    }

    let requests = [
        "GET / HTTP/1.1",
        "GET /about HTTP/1.1",
        "GET /missing HTTP/1.1",
    ];

    for line in requests {
        let line = line.to_string();
        let tx = res_tx.clone();
        job_tx
            .send(Box::new(move || {
                let body = body_for(&line);
                tx.send(format!("{} => {}", line, body)).unwrap();
            }))
            .unwrap();
    }

    drop(job_tx);
    for w in workers {
        w.join().unwrap();
    }

    drop(res_tx);
    let mut results: Vec<String> = res_rx.iter().collect();
    results.sort();
    for r in results {
        println!("{}", r);
    }
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    // TODO: 3 workers, process three request lines, collect & print results
}`,
    tags: ['threadpool', 'routing', 'channel'],
  },
  {
    id: 'rs-ch20-c-065',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full ThreadPool With new, execute, Drop',
    prompt: `Assemble the complete library-style ThreadPool from the chapter and prove it works.

Implement:
- type Job = Box<dyn FnOnce() + Send + 'static>;
- struct Worker { id: usize, thread: Option<thread::JoinHandle<()>> } with Worker::new(id, receiver) running a loop that prints "worker {id} got a job" then runs it, breaking on disconnect.
- struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> } with new(size), execute, and Drop that drops the sender then joins each worker (printing "shutting down worker {id}").

In main: create a pool of 2 inside a scope, execute three jobs that each print "doing work", then let the pool drop. You should see three "got a job"/"doing work" pairs and two shutdown lines.`,
    hints: [
      'execute boxes f and sends it via self.sender.as_ref().unwrap().send.',
      'Worker stores Option<JoinHandle<()>> so Drop can take and join it.',
      'Drop: self.sender.take(); then for each worker, take and join its thread.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => {
                    println!("worker {} got a job", id);
                    job();
                }
                Err(_) => break,
            }
        });
        Worker { id, thread: Some(thread) }
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }
        ThreadPool { workers, sender: Some(sender) }
    }

    fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        self.sender.as_ref().unwrap().send(Box::new(f)).unwrap();
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        drop(self.sender.take());
        for worker in &mut self.workers {
            println!("shutting down worker {}", worker.id);
            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
        }
    }
}

fn main() {
    {
        let pool = ThreadPool::new(2);
        for _ in 0..3 {
            pool.execute(|| println!("doing work"));
        }
    }
    println!("pool dropped");
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker { id: usize, thread: Option<thread::JoinHandle<()>> }
struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> }

// TODO: impl Worker::new, ThreadPool::new + execute, and Drop

fn main() {
    {
        let pool = ThreadPool::new(2);
        for _ in 0..3 {
            pool.execute(|| println!("doing work"));
        }
    }
    println!("pool dropped");
}`,
    tags: ['threadpool', 'drop', 'execute'],
  },
  {
    id: 'rs-ch20-c-066',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Single-Threaded Request Handler',
    prompt: `Write the pure logic of a single-threaded handler so it can be tested without sockets.

Write a function:

    fn handle_request(request: &[String]) -> String

Given the lines of an HTTP request (first line is the request line), it returns a full response string:
- If the request is empty, return "HTTP/1.1 400 BAD REQUEST\\r\\nContent-Length: 0\\r\\n\\r\\n".
- If the request line is "GET / HTTP/1.1", body is "hello" with status "HTTP/1.1 200 OK".
- Otherwise body is "not found" with status "HTTP/1.1 404 NOT FOUND".
Non-empty responses include Content-Length (body byte length), a blank line, and the body.

In main, print (with debug formatting) the responses for an empty request, a root request, and an unknown request.`,
    hints: [
      'Get the first line with request.first(); handle the None/empty case first.',
      'Reuse a helper that formats status + Content-Length + body.',
      'For the empty case the body is the empty string so Content-Length is 0.',
    ],
    solution: `fn format_response(status: &str, body: &str) -> String {
    format!(
        "{}\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
        status,
        body.len(),
        body
    )
}

fn handle_request(request: &[String]) -> String {
    match request.first() {
        None => format_response("HTTP/1.1 400 BAD REQUEST", ""),
        Some(line) if line == "GET / HTTP/1.1" => {
            format_response("HTTP/1.1 200 OK", "hello")
        }
        Some(_) => format_response("HTTP/1.1 404 NOT FOUND", "not found"),
    }
}

fn main() {
    let empty: Vec<String> = Vec::new();
    let root = vec![String::from("GET / HTTP/1.1")];
    let other = vec![String::from("GET /x HTTP/1.1")];

    println!("{:?}", handle_request(&empty));
    println!("{:?}", handle_request(&root));
    println!("{:?}", handle_request(&other));
}`,
    starter: `fn handle_request(request: &[String]) -> String {
    // TODO: handle empty, root, and unknown requests
    todo!()
}

fn main() {
    let root = vec![String::from("GET / HTTP/1.1")];
    println!("{:?}", handle_request(&root));
}`,
    tags: ['http', 'handler', 'response'],
  },
  {
    id: 'rs-ch20-c-067',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Serve a File or 404 From Disk',
    prompt: `Combine file reading with routing. Write a function:

    fn serve(request_line: &str, hello_path: &str, not_found_path: &str) -> std::io::Result<String>

If request_line is "GET / HTTP/1.1", read the file at hello_path and use status "HTTP/1.1 200 OK"; otherwise read not_found_path and use status "HTTP/1.1 404 NOT FOUND". Return the full response string with Content-Length and a blank line. Propagate any file error with the question mark operator.

In main: write "<h1>Welcome</h1>" to a temp hello file and "<h1>Missing</h1>" to a temp 404 file (under std::env::temp_dir()), then call serve for the root request and for "GET /nope HTTP/1.1", printing each response.`,
    hints: [
      'Use std::fs::read_to_string and the ? operator to read either file.',
      'Choose (status, path) first, then read the body, then format the response.',
      'Build temp paths with std::env::temp_dir().join("name").',
    ],
    solution: `use std::fs;

fn serve(
    request_line: &str,
    hello_path: &str,
    not_found_path: &str,
) -> std::io::Result<String> {
    let (status, path) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", hello_path)
    } else {
        ("HTTP/1.1 404 NOT FOUND", not_found_path)
    };

    let body = fs::read_to_string(path)?;
    Ok(format!(
        "{}\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
        status,
        body.len(),
        body
    ))
}

fn main() {
    let dir = std::env::temp_dir();
    let hello = dir.join("hello.html");
    let not_found = dir.join("404.html");
    let hello_str = hello.to_str().unwrap();
    let nf_str = not_found.to_str().unwrap();

    fs::write(hello_str, "<h1>Welcome</h1>").unwrap();
    fs::write(nf_str, "<h1>Missing</h1>").unwrap();

    println!("{:?}", serve("GET / HTTP/1.1", hello_str, nf_str).unwrap());
    println!("{:?}", serve("GET /nope HTTP/1.1", hello_str, nf_str).unwrap());
}`,
    starter: `use std::fs;

fn serve(
    request_line: &str,
    hello_path: &str,
    not_found_path: &str,
) -> std::io::Result<String> {
    // TODO: pick status+path, read body, format response
    todo!()
}

fn main() {
    // TODO: write temp files and call serve twice
}`,
    tags: ['fs', 'routing', '404'],
  },
  {
    id: 'rs-ch20-c-068',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parse a Raw Request End to End',
    prompt: `Parse a complete raw HTTP request and produce a response, all from bytes - the same flow a real server runs over a TcpStream, but using a byte slice.

Write a function:

    fn process(raw: &[u8]) -> String

It must: wrap raw in a BufReader, read header lines until the blank line, take the first line as the request line, and route it: "GET / HTTP/1.1" gives body "ok" with status "HTTP/1.1 200 OK"; any other (including a missing request line) gives body "no" with status "HTTP/1.1 404 NOT FOUND". Return the full response (status, Content-Length, blank line, body).

In main, call process on the bytes for "GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n" and on "GET /bad HTTP/1.1\\r\\n\\r\\n", printing both responses with debug formatting.`,
    hints: [
      'BufReader::new(raw) lets you call .lines(); stop at the first empty line.',
      'request.into_iter().next() (or first()) gives the request line if present.',
      'Match the request line, then format the response with Content-Length.',
    ],
    solution: `use std::io::{BufRead, BufReader};

fn process(raw: &[u8]) -> String {
    let reader = BufReader::new(raw);
    let mut lines = Vec::new();
    for line in reader.lines() {
        let line = line.unwrap();
        if line.is_empty() {
            break;
        }
        lines.push(line);
    }

    let request_line = lines.first().map(|s| s.as_str()).unwrap_or("");
    let (status, body) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "ok")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "no")
    };

    format!(
        "{}\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
        status,
        body.len(),
        body
    )
}

fn main() {
    let good = b"GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n";
    let bad = b"GET /bad HTTP/1.1\\r\\n\\r\\n";
    println!("{:?}", process(&good[..]));
    println!("{:?}", process(&bad[..]));
}`,
    starter: `use std::io::{BufRead, BufReader};

fn process(raw: &[u8]) -> String {
    // TODO: read headers, take request line, route, format response
    todo!()
}

fn main() {
    let good = b"GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n";
    println!("{:?}", process(&good[..]));
}`,
    tags: ['http', 'bufreader', 'end-to-end'],
  },
  {
    id: 'rs-ch20-c-069',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pool Dispatching Parsed Requests',
    prompt: `Tie parsing, routing, and the thread pool together. Each raw request is handled on a worker thread, and the formatted response is sent back over a results channel.

In main:
1. Build a jobs channel of Box<dyn FnOnce() + Send + 'static> and spawn 2 workers sharing the receiver.
2. Build a results channel of String.
3. You have raw requests as byte vectors for: "GET / HTTP/1.1\\r\\n\\r\\n" and "GET /missing HTTP/1.1\\r\\n\\r\\n". For each, send a job that parses the request line (read until blank line), routes it (root -> 200 "home", else -> 404 "missing"), formats the full response, and sends it to results.
4. Drop the jobs sender, join the workers, drop the results sender, collect responses into a Vec, sort it, and print each with debug formatting.`,
    hints: [
      'Move each raw Vec<u8> and a results Sender clone into the job closure.',
      'Inside the job, use BufReader over the bytes to find the request line.',
      'Format status + Content-Length + blank line + body and send the String.',
    ],
    solution: `use std::io::{BufRead, BufReader};
use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn first_line(raw: &[u8]) -> String {
    let reader = BufReader::new(raw);
    for line in reader.lines() {
        let line = line.unwrap();
        if line.is_empty() {
            break;
        }
        return line;
    }
    String::new()
}

fn main() {
    let (job_tx, job_rx) = mpsc::channel::<Job>();
    let job_rx = Arc::new(Mutex::new(job_rx));
    let (res_tx, res_rx) = mpsc::channel::<String>();

    let mut workers = Vec::new();
    for _ in 0..2 {
        let recv = Arc::clone(&job_rx);
        workers.push(thread::spawn(move || loop {
            let message = recv.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        }));
    }

    let requests: Vec<Vec<u8>> = vec![
        b"GET / HTTP/1.1\\r\\n\\r\\n".to_vec(),
        b"GET /missing HTTP/1.1\\r\\n\\r\\n".to_vec(),
    ];

    for raw in requests {
        let tx = res_tx.clone();
        job_tx
            .send(Box::new(move || {
                let line = first_line(&raw);
                let (status, body) = if line == "GET / HTTP/1.1" {
                    ("HTTP/1.1 200 OK", "home")
                } else {
                    ("HTTP/1.1 404 NOT FOUND", "missing")
                };
                let response = format!(
                    "{}\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
                    status,
                    body.len(),
                    body
                );
                tx.send(response).unwrap();
            }))
            .unwrap();
    }

    drop(job_tx);
    for w in workers {
        w.join().unwrap();
    }

    drop(res_tx);
    let mut responses: Vec<String> = res_rx.iter().collect();
    responses.sort();
    for r in responses {
        println!("{:?}", r);
    }
}`,
    starter: `use std::io::{BufRead, BufReader};
use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    // TODO: 2 workers parse+route raw requests, send responses, collect & print
}`,
    tags: ['threadpool', 'http', 'end-to-end'],
  },
  {
    id: 'rs-ch20-c-070',
    chapter: 20,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Capstone: Pool, Routes, and Shutdown',
    prompt: `Capstone. Build a self-contained server core: a library-style ThreadPool with graceful shutdown that handles a fixed batch of requests and reports a summary.

Requirements:
- type Job = Box<dyn FnOnce() + Send + 'static>;
- struct Worker { id: usize, thread: Option<thread::JoinHandle<()>> } with Worker::new(id, receiver) running jobs in a loop, breaking on disconnect.
- struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> } with new(size), execute, and a Drop impl that drops the sender and joins all workers (printing "shut down worker {id}").
- In main: create a pool of 3, a results channel of String, and a counter Arc<Mutex<usize>>. For each request line in ["GET / HTTP/1.1", "GET /about HTTP/1.1", "GET /missing HTTP/1.1"], execute a job that increments the counter, computes a body (root -> "home", about -> "about", else -> "404"), and sends "{request_line}: {body}" to results.
- Drop the pool explicitly with drop(pool) so all jobs finish and shutdown messages print, then drop the results sender, collect & sort the results, print each, and finally print "handled {n} requests" using the counter (must be 3).`,
    hints: [
      'Move a counter Arc clone and a results Sender clone into each job.',
      'drop(pool) triggers Drop, which ends the workers and joins them.',
      'Collect results AFTER dropping the pool and the original results sender.',
    ],
    solution: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        });
        Worker { id, thread: Some(thread) }
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        assert!(size > 0);
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }
        ThreadPool { workers, sender: Some(sender) }
    }

    fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        self.sender.as_ref().unwrap().send(Box::new(f)).unwrap();
    }
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        drop(self.sender.take());
        for worker in &mut self.workers {
            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
            println!("shut down worker {}", worker.id);
        }
    }
}

fn body_for(line: &str) -> &'static str {
    match line {
        "GET / HTTP/1.1" => "home",
        "GET /about HTTP/1.1" => "about",
        _ => "404",
    }
}

fn main() {
    let (res_tx, res_rx) = mpsc::channel::<String>();
    let counter = Arc::new(Mutex::new(0usize));

    let pool = ThreadPool::new(3);
    let requests = [
        "GET / HTTP/1.1",
        "GET /about HTTP/1.1",
        "GET /missing HTTP/1.1",
    ];

    for line in requests {
        let line = line.to_string();
        let tx = res_tx.clone();
        let c = Arc::clone(&counter);
        pool.execute(move || {
            *c.lock().unwrap() += 1;
            let body = body_for(&line);
            tx.send(format!("{}: {}", line, body)).unwrap();
        });
    }

    drop(pool);
    drop(res_tx);

    let mut results: Vec<String> = res_rx.iter().collect();
    results.sort();
    for r in results {
        println!("{}", r);
    }

    let n = *counter.lock().unwrap();
    println!("handled {} requests", n);
}`,
    starter: `use std::sync::{Arc, Mutex, mpsc};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

struct Worker { id: usize, thread: Option<thread::JoinHandle<()>> }
struct ThreadPool { workers: Vec<Worker>, sender: Option<mpsc::Sender<Job>> }

// TODO: implement Worker::new, ThreadPool::new + execute, and Drop

fn main() {
    // TODO: pool of 3, run 3 requests, drop pool, collect results, print summary
}`,
    tags: ['threadpool', 'shutdown', 'capstone'],
  },
]

export default problems
