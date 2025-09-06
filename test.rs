const MAX_POINTS: u32 = 100_000;

fn main() {
    println!("Hello, Rust!");

    let x = 5;
    let mut y = 10;
    y = y * 2;

    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
    println!("Maximum points: {}", MAX_POINTS);

    if y > 15 {
        println!("y is greater than 15");
    } else {
        println!("y is not greater than 15");
    }
}
