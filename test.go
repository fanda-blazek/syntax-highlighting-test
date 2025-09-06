package main

import "fmt"

type Message struct {
	Text string
}

func greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}

func main() {
	message := Message{Text: "Welcome to Go!"}
	fmt.Println(message.Text)

	fmt.Println(greet("World"))
}
