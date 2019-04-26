package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	repeats := 10
	samples := 1000000

	var times [10]int
	var sum int = 0

	for i := 0; i < repeats; i++ {
		start := time.Now().UnixNano() / 1E6
		for j := 0; j < samples; j++ {
			rand.Float64()
		}
		end := time.Now().UnixNano() / 1E6
		times[i] = int(end - start)
		sum += times[i]
	}
	fmt.Printf("Mean time per iteration (ms): %e\n", float64(sum)/float64(repeats*samples))
}
