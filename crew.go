package main

import (
    "math/rand"
    "strconv"
    "time"
)

type Crew struct {
    crewid int
    name string
}


var crewid int

func makeNewCrewInit() *Crew {
    crew := new(Crew)
    crew.crewid = crewid
    crewid++
    rand.Seed(time.Now().UnixNano())
    n := "Mocho"
    n += strconv.Itoa(rand.Intn(100000))
    crew.name = n
    return crew
}

func makeNewCrew(n string) *Crew {
    crew := new(Crew)
    crew.crewid = crewid
    crewid++
    crew.name = n
    return crew
}
