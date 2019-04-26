package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"github.com/gorilla/mux"
)

type User struct {
	ID        string  `json:"id,omitempty"`
	Firstname string  `json:"firstname,omitempty"`
	Lastname  string  `json:"lastname,omitempty"`
	Key       float64 `json:"key,omitempty"`
}

var users = []User{
	User{ID: "1", Firstname: "Test", Lastname: "User1"},
	User{ID: "2", Firstname: "Test", Lastname: "User2"},
	User{ID: "3", Firstname: "Test", Lastname: "User3"},
}

const numUsers int = 3

func GetUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	for i := 0; i < numUsers; i++ {
		users[i].Key = rand.Float64()
	}
	json.NewEncoder(w).Encode(users)
}

func main() {
	router := mux.NewRouter()
	fmt.Printf("Starting API at 127.0.0.1:8000...")
	router.HandleFunc("/users", GetUsers).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}
