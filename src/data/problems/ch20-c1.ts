import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch20-c-001',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Bind a TcpListener',
    prompt: `The first step of a web server is to listen on an address. Use \`TcpListener::bind\` to bind to \`127.0.0.1:7878\` and \`unwrap()\` the result into a variable named \`listener\`.

After binding, print \`server bound\` so you can confirm the listener was created.`,
    hints: [
      'Bring the type into scope with \`use std::net::TcpListener;\`.',
      '\`TcpListener::bind\` returns a \`Result\`; call \`unwrap()\` on it.',
    ],
    solution: `use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    let _ = &listener;
    println!("server bound");
}`,
    starter: `use std::net::TcpListener;

fn main() {
    // TODO: bind to 127.0.0.1:7878 into \`listener\`, then print "server bound"
}`,
    tags: ['tcplistener', 'networking'],
  },
  {
    id: 'rs-ch20-c-002',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'The Server Address String',
    prompt: `Write a function \`server_addr() -> String\` that returns the string \`127.0.0.1:7878\`. This is the address a typical Rust book web server binds to.

In \`main\`, call the function and print the result.`,
    hints: [
      'Return the literal as an owned \`String\` with \`.to_string()\`.',
    ],
    solution: `fn server_addr() -> String {
    "127.0.0.1:7878".to_string()
}

fn main() {
    println!("{}", server_addr());
}`,
    starter: `fn server_addr() -> String {
    // TODO: return "127.0.0.1:7878" as a String
}

fn main() {
    println!("{}", server_addr());
}`,
    tags: ['strings', 'functions'],
  },
  {
    id: 'rs-ch20-c-003',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Build a Status Line',
    prompt: `An HTTP response begins with a status line. Write a function \`status_line() -> String\` that returns exactly \`HTTP/1.1 200 OK\`.

In \`main\`, print the result of the function.`,
    hints: [
      'The version, code, and reason phrase are separated by single spaces.',
    ],
    solution: `fn status_line() -> String {
    "HTTP/1.1 200 OK".to_string()
}

fn main() {
    println!("{}", status_line());
}`,
    starter: `fn status_line() -> String {
    // TODO: return the HTTP 200 status line
}

fn main() {
    println!("{}", status_line());
}`,
    tags: ['http', 'strings'],
  },
  {
    id: 'rs-ch20-c-004',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'The Request Line',
    prompt: `When a browser asks for the home page, the first line of its request looks like \`GET / HTTP/1.1\`. Write a function \`home_request_line() -> String\` that returns that exact string.

Print it from \`main\`.`,
    hints: [
      'The three parts are the method, the path, and the HTTP version.',
    ],
    solution: `fn home_request_line() -> String {
    "GET / HTTP/1.1".to_string()
}

fn main() {
    println!("{}", home_request_line());
}`,
    starter: `fn home_request_line() -> String {
    // TODO: return "GET / HTTP/1.1"
}

fn main() {
    println!("{}", home_request_line());
}`,
    tags: ['http', 'strings'],
  },
  {
    id: 'rs-ch20-c-005',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Detect the Home Route',
    prompt: `Write a function \`is_home(request_line: &str) -> bool\` that returns \`true\` when the request line is exactly \`GET / HTTP/1.1\`, and \`false\` otherwise.

In \`main\`, print the result of calling it with \`GET / HTTP/1.1\` and again with \`GET /about HTTP/1.1\`.`,
    hints: [
      'Compare the slice to the literal with \`==\`.',
    ],
    solution: `fn is_home(request_line: &str) -> bool {
    request_line == "GET / HTTP/1.1"
}

fn main() {
    println!("{}", is_home("GET / HTTP/1.1"));
    println!("{}", is_home("GET /about HTTP/1.1"));
}`,
    starter: `fn is_home(request_line: &str) -> bool {
    // TODO: true only for "GET / HTTP/1.1"
}

fn main() {
    println!("{}", is_home("GET / HTTP/1.1"));
    println!("{}", is_home("GET /about HTTP/1.1"));
}`,
    tags: ['http', 'routing'],
  },
  {
    id: 'rs-ch20-c-006',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Reason Phrase for 404',
    prompt: `Write a function \`not_found_line() -> String\` that returns the status line for a missing page: \`HTTP/1.1 404 NOT FOUND\`.

Print it from \`main\`.`,
    hints: [
      'The reason phrase \`NOT FOUND\` is upper case here, matching the book.',
    ],
    solution: `fn not_found_line() -> String {
    "HTTP/1.1 404 NOT FOUND".to_string()
}

fn main() {
    println!("{}", not_found_line());
}`,
    starter: `fn not_found_line() -> String {
    // TODO: return the HTTP 404 status line
}

fn main() {
    println!("{}", not_found_line());
}`,
    tags: ['http', '404'],
  },
  {
    id: 'rs-ch20-c-007',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Measure the Body Length',
    prompt: `HTTP responses include a \`Content-Length\` header. Write a function \`content_length(body: &str) -> usize\` that returns the number of bytes in \`body\` using \`.len()\`.

In \`main\`, print the content length of \`hello\`. The output should be \`5\`.`,
    hints: [
      '\`str::len\` returns the length in bytes as a \`usize\`.',
    ],
    solution: `fn content_length(body: &str) -> usize {
    body.len()
}

fn main() {
    println!("{}", content_length("hello"));
}`,
    starter: `fn content_length(body: &str) -> usize {
    // TODO: return the byte length of body
}

fn main() {
    println!("{}", content_length("hello"));
}`,
    tags: ['http', 'headers'],
  },
  {
    id: 'rs-ch20-c-008',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Tiny HTML Page',
    prompt: `Write a function \`page() -> String\` that returns a minimal HTML document: the single line \`<html><body>Hello!</body></html>\`.

Print it from \`main\`.`,
    hints: [
      'Just return the literal as a \`String\`.',
    ],
    solution: `fn page() -> String {
    "<html><body>Hello!</body></html>".to_string()
}

fn main() {
    println!("{}", page());
}`,
    starter: `fn page() -> String {
    // TODO: return the HTML document string
}

fn main() {
    println!("{}", page());
}`,
    tags: ['html', 'strings'],
  },
  {
    id: 'rs-ch20-c-009',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Count the Request Lines',
    prompt: `An HTTP request is several lines of text. Write a function \`line_count(request: &str) -> usize\` that returns how many lines \`request\` has, using \`.lines().count()\`.

In \`main\`, call it on \`"GET / HTTP/1.1\\nHost: localhost\\n"\` and print the result. The output should be \`2\`.`,
    hints: [
      '\`str::lines\` yields an iterator over the lines; \`.count()\` consumes it.',
    ],
    solution: `fn line_count(request: &str) -> usize {
    request.lines().count()
}

fn main() {
    let request = "GET / HTTP/1.1\\nHost: localhost\\n";
    println!("{}", line_count(request));
}`,
    starter: `fn line_count(request: &str) -> usize {
    // TODO: count the lines in request
}

fn main() {
    let request = "GET / HTTP/1.1\\nHost: localhost\\n";
    println!("{}", line_count(request));
}`,
    tags: ['http', 'iterators'],
  },
  {
    id: 'rs-ch20-c-010',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Grab the First Line',
    prompt: `The request line is the first line of an HTTP request. Write a function \`first_line(request: &str) -> &str\` that returns the first line using \`.lines().next().unwrap()\`.

In \`main\`, call it on \`"GET /about HTTP/1.1\\nHost: x\\n"\` and print the result. The output should be \`GET /about HTTP/1.1\`.`,
    hints: [
      '\`.lines().next()\` gives an \`Option<&str>\` for the first line.',
    ],
    solution: `fn first_line(request: &str) -> &str {
    request.lines().next().unwrap()
}

fn main() {
    let request = "GET /about HTTP/1.1\\nHost: x\\n";
    println!("{}", first_line(request));
}`,
    starter: `fn first_line(request: &str) -> &str {
    // TODO: return the first line of request
}

fn main() {
    let request = "GET /about HTTP/1.1\\nHost: x\\n";
    println!("{}", first_line(request));
}`,
    tags: ['http', 'parsing'],
  },
  {
    id: 'rs-ch20-c-011',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Pick the Status Code',
    prompt: `Write a function \`code_for(found: bool) -> u16\` that returns \`200\` when \`found\` is \`true\` and \`404\` when it is \`false\`. Use an \`if\` expression.

In \`main\`, print \`code_for(true)\` and \`code_for(false)\`.`,
    hints: [
      'An \`if\`/\`else\` is an expression and can be the function body.',
    ],
    solution: `fn code_for(found: bool) -> u16 {
    if found { 200 } else { 404 }
}

fn main() {
    println!("{}", code_for(true));
    println!("{}", code_for(false));
}`,
    starter: `fn code_for(found: bool) -> u16 {
    // TODO: 200 if found, else 404
}

fn main() {
    println!("{}", code_for(true));
    println!("{}", code_for(false));
}`,
    tags: ['http', 'control-flow'],
  },
  {
    id: 'rs-ch20-c-012',
    chapter: 20,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Choose the File Name',
    prompt: `In the single-route server, the home page serves \`hello.html\` and everything else serves \`404.html\`. Write a function \`file_for(is_home: bool) -> &'static str\` that returns \`"hello.html"\` when \`is_home\` is true and \`"404.html"\` otherwise.

In \`main\`, print \`file_for(true)\` and \`file_for(false)\`.`,
    hints: [
      'Both string literals already have a static lifetime.',
    ],
    solution: `fn file_for(is_home: bool) -> &'static str {
    if is_home { "hello.html" } else { "404.html" }
}

fn main() {
    println!("{}", file_for(true));
    println!("{}", file_for(false));
}`,
    starter: `fn file_for(is_home: bool) -> &'static str {
    // TODO: choose the html file name
}

fn main() {
    println!("{}", file_for(true));
    println!("{}", file_for(false));
}`,
    tags: ['routing', 'lifetimes'],
  },
  {
    id: 'rs-ch20-c-013',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Accept Connections in a Loop',
    prompt: `Bind a \`TcpListener\` to \`127.0.0.1:7878\`, then loop over \`listener.incoming()\`. For each item, \`unwrap()\` the stream into \`stream\` and print \`connection established\`.

Because this would block forever, do NOT actually run a server: instead just write the code. In \`main\`, only print \`ready\` so the program compiles and exits.`,
    hints: [
      'Show the loop in a separate function you do not call.',
      '\`incoming()\` yields \`Result<TcpStream, _>\` items.',
    ],
    solution: `use std::net::{TcpListener, TcpStream};

fn serve(listener: TcpListener) {
    for stream in listener.incoming() {
        let stream: TcpStream = stream.unwrap();
        let _ = &stream;
        println!("connection established");
    }
}

fn main() {
    let _serve = serve;
    println!("ready");
}`,
    starter: `use std::net::{TcpListener, TcpStream};

fn serve(listener: TcpListener) {
    // TODO: loop over listener.incoming(), unwrap each stream, print "connection established"
}

fn main() {
    let _serve = serve;
    println!("ready");
}`,
    tags: ['tcplistener', 'incoming'],
  },
  {
    id: 'rs-ch20-c-014',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Split the Request Line',
    prompt: `A request line is \`METHOD PATH VERSION\` separated by spaces. Write a function \`parts(line: &str) -> Vec<&str>\` that splits \`line\` on whitespace and collects the pieces into a \`Vec\`.

In \`main\`, call it on \`"GET /about HTTP/1.1"\` and print the vector with \`{:?}\`. The output should be \`["GET", "/about", "HTTP/1.1"]\`.`,
    hints: [
      'Use \`split_whitespace()\` then \`.collect()\`.',
      'Annotate the collect target as \`Vec<&str>\` or rely on the return type.',
    ],
    solution: `fn parts(line: &str) -> Vec<&str> {
    line.split_whitespace().collect()
}

fn main() {
    let line = "GET /about HTTP/1.1";
    println!("{:?}", parts(line));
}`,
    starter: `fn parts(line: &str) -> Vec<&str> {
    // TODO: split on whitespace and collect
}

fn main() {
    let line = "GET /about HTTP/1.1";
    println!("{:?}", parts(line));
}`,
    tags: ['parsing', 'vectors'],
  },
  {
    id: 'rs-ch20-c-015',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Extract the Method',
    prompt: `Write a function \`method(line: &str) -> Option<&str>\` that returns the HTTP method (the first whitespace-separated token) of a request line, or \`None\` if the line is empty.

In \`main\`, print the result for \`"POST /submit HTTP/1.1"\` and for \`""\` using \`{:?}\`.`,
    hints: [
      '\`split_whitespace().next()\` already returns an \`Option<&str>\`.',
    ],
    solution: `fn method(line: &str) -> Option<&str> {
    line.split_whitespace().next()
}

fn main() {
    println!("{:?}", method("POST /submit HTTP/1.1"));
    println!("{:?}", method(""));
}`,
    starter: `fn method(line: &str) -> Option<&str> {
    // TODO: return the first token, or None
}

fn main() {
    println!("{:?}", method("POST /submit HTTP/1.1"));
    println!("{:?}", method(""));
}`,
    tags: ['parsing', 'option'],
  },
  {
    id: 'rs-ch20-c-016',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Extract the Path',
    prompt: `Write a function \`path(line: &str) -> Option<&str>\` that returns the request path (the SECOND whitespace-separated token) of a request line, or \`None\` if there is no second token.

In \`main\`, print the path of \`"GET /style.css HTTP/1.1"\` and of \`"GET"\` using \`{:?}\`.`,
    hints: [
      'Skip the first token, then take the next: \`.nth(1)\`.',
    ],
    solution: `fn path(line: &str) -> Option<&str> {
    line.split_whitespace().nth(1)
}

fn main() {
    println!("{:?}", path("GET /style.css HTTP/1.1"));
    println!("{:?}", path("GET"));
}`,
    starter: `fn path(line: &str) -> Option<&str> {
    // TODO: return the second token, or None
}

fn main() {
    println!("{:?}", path("GET /style.css HTTP/1.1"));
    println!("{:?}", path("GET"));
}`,
    tags: ['parsing', 'option'],
  },
  {
    id: 'rs-ch20-c-017',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Format a Full Response',
    prompt: `Write a function \`response(status: &str, body: &str) -> String\` that builds a complete HTTP response string. It must equal the status line, then \`\\r\\n\`, a \`Content-Length\` header equal to the body length, then a blank line, then the body. Use \`format!\`.

The exact shape is: \`"{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}"\` where \`len\` is \`body.len()\`.

In \`main\`, print \`response("HTTP/1.1 200 OK", "hi")\` using \`{:?}\` so the escapes are visible.`,
    hints: [
      'Compute the length first: \`let len = body.len();\`.',
      'Build the string with one \`format!\` call.',
    ],
    solution: `fn response(status: &str, body: &str) -> String {
    let len = body.len();
    format!("{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}")
}

fn main() {
    println!("{:?}", response("HTTP/1.1 200 OK", "hi"));
}`,
    starter: `fn response(status: &str, body: &str) -> String {
    // TODO: build "status\\r\\nContent-Length: len\\r\\n\\r\\nbody"
}

fn main() {
    println!("{:?}", response("HTTP/1.1 200 OK", "hi"));
}`,
    tags: ['http', 'format'],
  },
  {
    id: 'rs-ch20-c-018',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read a Request With BufReader',
    prompt: `Show how the book reads a request: given anything implementing \`BufRead\`, take lines until the first empty one. Write a function \`read_request<R: BufRead>(reader: R) -> Vec<String>\` that collects each line (each is a \`Result<String, _>\`, so \`unwrap()\`) and stops as soon as a line is empty.

Demonstrate it in \`main\` by wrapping a byte slice in a \`BufReader\`: feed \`b"GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n"\` and print the collected lines with \`{:?}\`. (Note: \`.lines()\` strips the trailing CRLF.)`,
    hints: [
      'Bring in \`use std::io::{BufRead, BufReader};\`.',
      'Loop over \`reader.lines()\`, push until a line equals the empty string, then \`break\`.',
    ],
    solution: `use std::io::{BufRead, BufReader};

fn read_request<R: BufRead>(reader: R) -> Vec<String> {
    let mut out = Vec::new();
    for line in reader.lines() {
        let line = line.unwrap();
        if line.is_empty() {
            break;
        }
        out.push(line);
    }
    out
}

fn main() {
    let data = b"GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n";
    let reader = BufReader::new(&data[..]);
    let lines = read_request(reader);
    println!("{:?}", lines);
}`,
    starter: `use std::io::{BufRead, BufReader};

fn read_request<R: BufRead>(reader: R) -> Vec<String> {
    // TODO: collect lines until the first empty one
}

fn main() {
    let data = b"GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n";
    let reader = BufReader::new(&data[..]);
    let lines = read_request(reader);
    println!("{:?}", lines);
}`,
    tags: ['bufreader', 'io'],
  },
  {
    id: 'rs-ch20-c-019',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Route to a Status and File',
    prompt: `Write a function \`route(request_line: &str) -> (&'static str, &'static str)\` that returns a tuple of (status line, file name). For \`"GET / HTTP/1.1"\` return \`("HTTP/1.1 200 OK", "hello.html")\`. For anything else return \`("HTTP/1.1 404 NOT FOUND", "404.html")\`.

In \`main\`, print the result for the home request and for \`"GET /nope HTTP/1.1"\` using \`{:?}\`.`,
    hints: [
      'Use an \`if\`/\`else\` that returns the whole tuple.',
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
    println!("{:?}", route("GET /nope HTTP/1.1"));
}`,
    starter: `fn route(request_line: &str) -> (&'static str, &'static str) {
    // TODO: return (status, file) based on the request line
}

fn main() {
    println!("{:?}", route("GET / HTTP/1.1"));
    println!("{:?}", route("GET /nope HTTP/1.1"));
}`,
    tags: ['routing', 'tuples'],
  },
  {
    id: 'rs-ch20-c-020',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match on the Request Line',
    prompt: `Rewrite routing with a \`match\` on a string slice. Write \`route(request_line: &str) -> (&'static str, &'static str)\` that matches \`"GET / HTTP/1.1"\` to \`("HTTP/1.1 200 OK", "hello.html")\` and uses a wildcard arm \`_\` returning \`("HTTP/1.1 404 NOT FOUND", "404.html")\`.

In \`main\`, print the result for the home request and for \`"GET /missing HTTP/1.1"\`.`,
    hints: [
      'Match on \`request_line\` and provide a literal arm plus \`_\`.',
    ],
    solution: `fn route(request_line: &str) -> (&'static str, &'static str) {
    match request_line {
        "GET / HTTP/1.1" => ("HTTP/1.1 200 OK", "hello.html"),
        _ => ("HTTP/1.1 404 NOT FOUND", "404.html"),
    }
}

fn main() {
    println!("{:?}", route("GET / HTTP/1.1"));
    println!("{:?}", route("GET /missing HTTP/1.1"));
}`,
    starter: `fn route(request_line: &str) -> (&'static str, &'static str) {
    // TODO: match request_line to (status, file)
}

fn main() {
    println!("{:?}", route("GET / HTTP/1.1"));
    println!("{:?}", route("GET /missing HTTP/1.1"));
}`,
    tags: ['routing', 'match'],
  },
  {
    id: 'rs-ch20-c-021',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Three-Route Match',
    prompt: `Support three routes. Write \`page_for(request_line: &str) -> &'static str\` that returns:
- \`"home"\` for \`"GET / HTTP/1.1"\`
- \`"about"\` for \`"GET /about HTTP/1.1"\`
- \`"not found"\` for anything else

In \`main\`, print the result for all three of: the home line, the about line, and \`"GET /xyz HTTP/1.1"\`.`,
    hints: [
      'A \`match\` with two literal arms and a \`_\` arm.',
    ],
    solution: `fn page_for(request_line: &str) -> &'static str {
    match request_line {
        "GET / HTTP/1.1" => "home",
        "GET /about HTTP/1.1" => "about",
        _ => "not found",
    }
}

fn main() {
    println!("{}", page_for("GET / HTTP/1.1"));
    println!("{}", page_for("GET /about HTTP/1.1"));
    println!("{}", page_for("GET /xyz HTTP/1.1"));
}`,
    starter: `fn page_for(request_line: &str) -> &'static str {
    // TODO: match three cases
}

fn main() {
    println!("{}", page_for("GET / HTTP/1.1"));
    println!("{}", page_for("GET /about HTTP/1.1"));
    println!("{}", page_for("GET /xyz HTTP/1.1"));
}`,
    tags: ['routing', 'match'],
  },
  {
    id: 'rs-ch20-c-022',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build the Response Bytes',
    prompt: `A response is written to a stream as bytes. Write a function \`response_bytes(status: &str, body: &str) -> Vec<u8>\` that formats \`"{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}"\` (with \`len = body.len()\`) and returns its bytes via \`.into_bytes()\`.

In \`main\`, build the bytes for \`("HTTP/1.1 200 OK", "ok")\` and print the length of the vector.`,
    hints: [
      'Build the \`String\` with \`format!\`, then call \`.into_bytes()\`.',
    ],
    solution: `fn response_bytes(status: &str, body: &str) -> Vec<u8> {
    let len = body.len();
    let text = format!("{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}");
    text.into_bytes()
}

fn main() {
    let bytes = response_bytes("HTTP/1.1 200 OK", "ok");
    println!("{}", bytes.len());
}`,
    starter: `fn response_bytes(status: &str, body: &str) -> Vec<u8> {
    // TODO: format the response, then into_bytes()
}

fn main() {
    let bytes = response_bytes("HTTP/1.1 200 OK", "ok");
    println!("{}", bytes.len());
}`,
    tags: ['http', 'bytes'],
  },
  {
    id: 'rs-ch20-c-023',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Write a Response to a Vec',
    prompt: `Writing to a \`TcpStream\` uses \`Write::write_all\`. A \`Vec<u8>\` also implements \`Write\`, so you can practice without a socket. Write a function \`send<W: Write>(mut out: W, bytes: &[u8])\` that calls \`out.write_all(bytes).unwrap()\`.

In \`main\`, create a \`Vec<u8>\`, send \`b"HTTP/1.1 200 OK"\` into it, then print it as a string with \`String::from_utf8_lossy\`.`,
    hints: [
      'Bring in \`use std::io::Write;\`.',
      'Pass \`&mut buf\` to \`send\` so you can inspect \`buf\` afterward.',
    ],
    solution: `use std::io::Write;

fn send<W: Write>(mut out: W, bytes: &[u8]) {
    out.write_all(bytes).unwrap();
}

fn main() {
    let mut buf: Vec<u8> = Vec::new();
    send(&mut buf, b"HTTP/1.1 200 OK");
    println!("{}", String::from_utf8_lossy(&buf));
}`,
    starter: `use std::io::Write;

fn send<W: Write>(mut out: W, bytes: &[u8]) {
    // TODO: write_all the bytes and unwrap
}

fn main() {
    let mut buf: Vec<u8> = Vec::new();
    send(&mut buf, b"HTTP/1.1 200 OK");
    println!("{}", String::from_utf8_lossy(&buf));
}`,
    tags: ['io', 'write'],
  },
  {
    id: 'rs-ch20-c-024',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Read a File Into a String',
    prompt: `Serving an HTML file uses \`fs::read_to_string\`. Write a function \`load(path: &str) -> String\` that reads the file at \`path\` and returns its contents, treating a read error as the fallback string \`"<not found>"\` via \`unwrap_or_else\`.

In \`main\`, call \`load("definitely_missing_file.html")\` and print the result (it should print \`<not found>\` since the file does not exist).`,
    hints: [
      'Bring in \`use std::fs;\`.',
      '\`fs::read_to_string\` returns a \`Result<String, _>\`; use \`unwrap_or_else(|_| ...)\`.',
    ],
    solution: `use std::fs;

fn load(path: &str) -> String {
    fs::read_to_string(path).unwrap_or_else(|_| "<not found>".to_string())
}

fn main() {
    println!("{}", load("definitely_missing_file.html"));
}`,
    starter: `use std::fs;

fn load(path: &str) -> String {
    // TODO: read the file, falling back to "<not found>"
}

fn main() {
    println!("{}", load("definitely_missing_file.html"));
}`,
    tags: ['fs', 'files'],
  },
  {
    id: 'rs-ch20-c-025',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Handle a Request End to End',
    prompt: `Combine routing and response building. Write \`handle(request_line: &str) -> String\` that:
1. Picks \`("HTTP/1.1 200 OK", "Welcome")\` for \`"GET / HTTP/1.1"\`, else \`("HTTP/1.1 404 NOT FOUND", "Missing")\`.
2. Returns \`"{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}"\` with \`len = body.len()\`.

In \`main\`, print \`handle("GET / HTTP/1.1")\` and \`handle("GET /x HTTP/1.1")\` using \`{:?}\`.`,
    hints: [
      'Destructure the tuple: \`let (status, body) = ...;\`.',
      'Reuse one \`format!\` for both branches.',
    ],
    solution: `fn handle(request_line: &str) -> String {
    let (status, body) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "Welcome")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "Missing")
    };
    let len = body.len();
    format!("{status}\\r\\nContent-Length: {len}\\r\\n\\r\\n{body}")
}

fn main() {
    println!("{:?}", handle("GET / HTTP/1.1"));
    println!("{:?}", handle("GET /x HTTP/1.1"));
}`,
    starter: `fn handle(request_line: &str) -> String {
    // TODO: route, then build the response string
}

fn main() {
    println!("{:?}", handle("GET / HTTP/1.1"));
    println!("{:?}", handle("GET /x HTTP/1.1"));
}`,
    tags: ['http', 'routing'],
  },
  {
    id: 'rs-ch20-c-026',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Boxed Job Type',
    prompt: `The ThreadPool stores jobs as boxed closures. Define the type alias \`type Job = Box<dyn FnOnce() + Send + 'static>;\`. Then write a function \`run_job(job: Job)\` that calls the job (\`job()\`).

In \`main\`, box a closure that prints \`doing work\` as a \`Job\`, pass it to \`run_job\`, and confirm it runs.`,
    hints: [
      'A \`Box<dyn FnOnce()>\` can be called directly: \`job()\`.',
      'Create the job with \`Box::new(|| { ... })\`.',
    ],
    solution: `type Job = Box<dyn FnOnce() + Send + 'static>;

fn run_job(job: Job) {
    job();
}

fn main() {
    let job: Job = Box::new(|| println!("doing work"));
    run_job(job);
}`,
    starter: `type Job = Box<dyn FnOnce() + Send + 'static>;

fn run_job(job: Job) {
    // TODO: call the job
}

fn main() {
    let job: Job = Box::new(|| println!("doing work"));
    run_job(job);
}`,
    tags: ['threadpool', 'closures'],
  },
  {
    id: 'rs-ch20-c-027',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Why FnOnce, Send, and Static',
    prompt: `Write a generic function \`spawn_like<F>(f: F) where F: FnOnce() + Send + 'static\` that simply calls \`f()\`. These are the exact bounds \`thread::spawn\` and the ThreadPool require: \`FnOnce\` (the closure runs once), \`Send\` (it can move to another thread), \`'static\` (it owns its data).

In \`main\`, capture a \`String\` by move into a closure that prints it, and pass that closure to \`spawn_like\`.`,
    hints: [
      'Move the captured value with the \`move\` keyword.',
      'A \`String\` is \`Send\` and owned, so it satisfies the bounds.',
    ],
    solution: `fn spawn_like<F>(f: F)
where
    F: FnOnce() + Send + 'static,
{
    f();
}

fn main() {
    let name = String::from("worker");
    spawn_like(move || println!("hello, {name}"));
}`,
    starter: `fn spawn_like<F>(f: F)
where
    F: FnOnce() + Send + 'static,
{
    // TODO: call f
}

fn main() {
    let name = String::from("worker");
    // TODO: pass a move closure that prints name to spawn_like
}`,
    tags: ['threadpool', 'trait-bounds'],
  },
  {
    id: 'rs-ch20-c-028',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Send Jobs Over a Channel',
    prompt: `The ThreadPool sends jobs to workers through an \`mpsc\` channel. Create a channel with \`mpsc::channel::<Job>()\` where \`Job\` is \`Box<dyn FnOnce() + Send + 'static>\`. Send one boxed closure that prints \`task ran\`, then receive it with \`recv().unwrap()\` and call it.

Do everything in \`main\`.`,
    hints: [
      'Bring in \`use std::sync::mpsc;\`.',
      'Box the closure as a \`Job\` before sending: \`tx.send(Box::new(...))\`.',
    ],
    solution: `use std::sync::mpsc;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (tx, rx) = mpsc::channel::<Job>();
    tx.send(Box::new(|| println!("task ran"))).unwrap();
    let job = rx.recv().unwrap();
    job();
}`,
    starter: `use std::sync::mpsc;

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (tx, rx) = mpsc::channel::<Job>();
    // TODO: send a boxed closure, receive it, and call it
}`,
    tags: ['threadpool', 'channels'],
  },
  {
    id: 'rs-ch20-c-029',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The ThreadPool::new Signature',
    prompt: `Sketch the public API of \`ThreadPool\`. Define a struct \`ThreadPool\` holding a \`size: usize\` field, and an associated function \`new(size: usize) -> ThreadPool\` that stores the size. The book uses \`assert!(size > 0)\` so add that check.

In \`main\`, create a pool with \`ThreadPool::new(4)\` and print its \`size\` field.`,
    hints: [
      '\`assert!(size > 0);\` panics on a zero-size pool.',
      'Make the \`size\` field accessible by keeping it in the same module.',
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
    println!("{}", pool.size);
}`,
    starter: `struct ThreadPool {
    size: usize,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        // TODO: assert size > 0 and build the pool
    }
}

fn main() {
    let pool = ThreadPool::new(4);
    println!("{}", pool.size);
}`,
    tags: ['threadpool', 'api'],
  },
  {
    id: 'rs-ch20-c-030',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Worker With an Id',
    prompt: `Each thread in the pool is wrapped in a \`Worker\`. Define a struct \`Worker\` with an \`id: usize\` field and an associated function \`new(id: usize) -> Worker\` that stores it.

In \`main\`, create three workers with ids 0, 1, and 2 in a loop using \`Worker::new\`, push them into a \`Vec\`, and print the id of each.`,
    hints: [
      'Use \`for id in 0..3 { workers.push(Worker::new(id)); }\`.',
    ],
    solution: `struct Worker {
    id: usize,
}

impl Worker {
    fn new(id: usize) -> Worker {
        Worker { id }
    }
}

fn main() {
    let mut workers = Vec::new();
    for id in 0..3 {
        workers.push(Worker::new(id));
    }
    for w in &workers {
        println!("worker {}", w.id);
    }
}`,
    starter: `struct Worker {
    id: usize,
}

impl Worker {
    fn new(id: usize) -> Worker {
        // TODO: build a Worker with the id
    }
}

fn main() {
    let mut workers = Vec::new();
    // TODO: create workers 0..3 and print each id
}`,
    tags: ['threadpool', 'worker'],
  },
  {
    id: 'rs-ch20-c-031',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pool Holds a Vec of Workers',
    prompt: `Combine the pieces: a \`Worker\` with an \`id\`, and a \`ThreadPool\` whose \`new(size)\` builds a \`Vec<Worker>\` with ids \`0..size\` via \`with_capacity\` and a loop. Add a method \`count(&self) -> usize\` returning the number of workers.

In \`main\`, build a pool of size 3 and print \`count()\` (should be \`3\`).`,
    hints: [
      'Pre-size the vector with \`Vec::with_capacity(size)\`.',
      '\`count\` can just return \`self.workers.len()\`.',
    ],
    solution: `struct Worker {
    id: usize,
}

impl Worker {
    fn new(id: usize) -> Worker {
        Worker { id }
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

    fn count(&self) -> usize {
        self.workers.len()
    }
}

fn main() {
    let pool = ThreadPool::new(3);
    println!("{}", pool.count());
}`,
    starter: `struct Worker {
    id: usize,
}

impl Worker {
    fn new(id: usize) -> Worker {
        Worker { id }
    }
}

struct ThreadPool {
    workers: Vec<Worker>,
}

impl ThreadPool {
    fn new(size: usize) -> ThreadPool {
        // TODO: assert, build Vec<Worker> with ids 0..size
    }

    fn count(&self) -> usize {
        // TODO: return number of workers
    }
}

fn main() {
    let pool = ThreadPool::new(3);
    println!("{}", pool.count());
}`,
    tags: ['threadpool', 'worker'],
  },
  {
    id: 'rs-ch20-c-032',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The execute Method',
    prompt: `Add \`execute\` to a minimal pool. Define \`type Job = Box<dyn FnOnce() + Send + 'static>;\`. Give \`ThreadPool\` a \`jobs: Vec<Job>\` field. Write \`execute<F>(&mut self, f: F) where F: FnOnce() + Send + 'static\` that boxes \`f\` and pushes it onto \`jobs\`. Add \`run_all(&mut self)\` that pops each job with \`while let Some(job) = self.jobs.pop()\` and calls it.

In \`main\`, build a pool, \`execute\` a closure printing \`a\` and another printing \`b\`, then \`run_all\`.`,
    hints: [
      'Boxing inside \`execute\`: \`let job = Box::new(f);\`.',
      '\`run_all\` drains the vector by popping.',
    ],
    solution: `type Job = Box<dyn FnOnce() + Send + 'static>;

struct ThreadPool {
    jobs: Vec<Job>,
}

impl ThreadPool {
    fn new() -> ThreadPool {
        ThreadPool { jobs: Vec::new() }
    }

    fn execute<F>(&mut self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.jobs.push(job);
    }

    fn run_all(&mut self) {
        while let Some(job) = self.jobs.pop() {
            job();
        }
    }
}

fn main() {
    let mut pool = ThreadPool::new();
    pool.execute(|| println!("a"));
    pool.execute(|| println!("b"));
    pool.run_all();
}`,
    starter: `type Job = Box<dyn FnOnce() + Send + 'static>;

struct ThreadPool {
    jobs: Vec<Job>,
}

impl ThreadPool {
    fn new() -> ThreadPool {
        ThreadPool { jobs: Vec::new() }
    }

    fn execute<F>(&mut self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        // TODO: box f and push it
    }

    fn run_all(&mut self) {
        // TODO: pop and call each job
    }
}

fn main() {
    let mut pool = ThreadPool::new();
    pool.execute(|| println!("a"));
    pool.execute(|| println!("b"));
    pool.run_all();
}`,
    tags: ['threadpool', 'execute'],
  },
  {
    id: 'rs-ch20-c-033',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shared Receiver With Arc and Mutex',
    prompt: `Workers share one receiver behind \`Arc<Mutex<Receiver<Job>>>\`. Build a channel of \`Job\`, wrap the receiver in \`Arc::new(Mutex::new(rx))\`, send one job that prints \`shared work\`, then lock the receiver (\`receiver.lock().unwrap().recv().unwrap()\`) and run the job.

Do it all in \`main\`.`,
    hints: [
      'Bring in \`std::sync::{mpsc, Arc, Mutex}\`.',
      'Lock first, then \`recv\`, then call the returned job.',
    ],
    solution: `use std::sync::{mpsc, Arc, Mutex};

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (tx, rx) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(rx));

    tx.send(Box::new(|| println!("shared work"))).unwrap();

    let job = receiver.lock().unwrap().recv().unwrap();
    job();
}`,
    starter: `use std::sync::{mpsc, Arc, Mutex};

type Job = Box<dyn FnOnce() + Send + 'static>;

fn main() {
    let (tx, rx) = mpsc::channel::<Job>();
    let receiver = Arc::new(Mutex::new(rx));

    // TODO: send a job, then lock+recv+call it
}`,
    tags: ['threadpool', 'arc-mutex'],
  },
  {
    id: 'rs-ch20-c-034',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Optional Join Handle',
    prompt: `For graceful shutdown, each \`Worker\` stores its thread as \`Option<thread::JoinHandle<()>>\` so it can be \`take()\`n out later. Define \`Worker\` with fields \`id: usize\` and \`thread: Option<thread::JoinHandle<()>>\`. In \`new(id)\`, spawn a thread that prints \`worker started\` and store it as \`Some(handle)\`.

In \`main\`, create one worker, then \`take()\` its thread out of the \`Option\` and \`join().unwrap()\` it.`,
    hints: [
      '\`Option::take\` replaces the field with \`None\` and returns the old value.',
      'Make the worker \`mut\` so you can \`take\` the handle.',
    ],
    solution: `use std::thread;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        let handle = thread::spawn(|| {
            println!("worker started");
        });
        Worker {
            id,
            thread: Some(handle),
        }
    }
}

fn main() {
    let mut worker = Worker::new(0);
    println!("created worker {}", worker.id);
    if let Some(thread) = worker.thread.take() {
        thread.join().unwrap();
    }
}`,
    starter: `use std::thread;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        // TODO: spawn a thread printing "worker started", store as Some
    }
}

fn main() {
    let mut worker = Worker::new(0);
    println!("created worker {}", worker.id);
    // TODO: take the handle and join it
}`,
    tags: ['threadpool', 'join'],
  },
  {
    id: 'rs-ch20-c-035',
    chapter: 20,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Graceful Shutdown With Drop',
    prompt: `Implement graceful shutdown. Define \`ThreadPool\` holding \`workers: Vec<Worker>\`, where each \`Worker\` has \`id: usize\` and \`thread: Option<thread::JoinHandle<()>>\`. Build a pool of size 2; each worker just spawns a thread that prints \`worker N running\` (with its id). Implement \`Drop\` for \`ThreadPool\` so that for each worker it prints \`shutting down worker N\` and, if the handle is \`Some\`, joins it.

In \`main\`, build the pool, print \`pool created\`, and let it drop at the end of scope.`,
    hints: [
      'In \`Drop\`, iterate \`&mut self.workers\` and \`take()\` each thread.',
      'Join only when \`take()\` yields \`Some\`: \`if let Some(thread) = worker.thread.take()\`.',
    ],
    solution: `use std::thread;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        let handle = thread::spawn(move || {
            println!("worker {id} running");
        });
        Worker {
            id,
            thread: Some(handle),
        }
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

impl Drop for ThreadPool {
    fn drop(&mut self) {
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
    let _ = &pool;
    println!("pool created");
}`,
    starter: `use std::thread;

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    fn new(id: usize) -> Worker {
        let handle = thread::spawn(move || {
            println!("worker {id} running");
        });
        Worker {
            id,
            thread: Some(handle),
        }
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

impl Drop for ThreadPool {
    fn drop(&mut self) {
        // TODO: for each worker, print "shutting down worker N" and join its thread if Some
    }
}

fn main() {
    let pool = ThreadPool::new(2);
    let _ = &pool;
    println!("pool created");
}`,
    tags: ['threadpool', 'drop', 'shutdown'],
  },
]

export default problems
