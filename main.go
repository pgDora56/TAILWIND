package main

import (
    "fmt"
    "log"
    "net/http"
    // "time"
    // "math/rand"
    "strconv"
    // "strings"
    "sync"

    "github.com/gin-contrib/sessions"
    "github.com/gin-contrib/sessions/cookie"
    "github.com/gin-gonic/gin"
    "github.com/k0kubun/pp"
    "gopkg.in/olahol/melody.v1"
)

var userCnt int
var crewList map[*melody.Session]*Crew

func main() {
    log.Println("Start azure")

    // routerの初期設定
    router := gin.Default()
    store := cookie.NewStore([]byte("secret"))
    router.Use(sessions.Sessions("mysession", store))

    // js,css,faviconなどを読み込むためのasstes設定
    router.Static("/assets", "./assets")
    router.StaticFile("/favicon.ico", "./assets/favicon.ico")
    m := melody.New()

    lock := new(sync.Mutex) // 同じ処理で割り込みを起こさないためのもの
    crewList = make(map[*melody.Session]*Crew) // 接続者リスト、必要か？

    // "/azure"以下をひとグループとする & 各種GET時の処理
    rg := router.Group("/azure")
    rg.GET("/", func(ctx *gin.Context) {
        http.ServeFile(ctx.Writer, ctx.Request, "index.html")
    })

    rg.GET("/ws", func(ctx *gin.Context) {
        m.HandleRequest(ctx.Writer, ctx.Request)
    })

    // 以下、melodyの設定
    m.HandleMessage(func (s *melody.Session, msg []byte) {
        msgs := string(msg)
        m.Broadcast(msg)

        log.Printf(msgs)
    })


    m.HandleConnect(func(s *melody.Session) {
        lock.Lock()
        log.Printf("Azure connection open, [session: %#v]\n", s)

        if c, ok := crewList[s]; ok {
            s.Write([]byte(c.name))
        } else {
            crew := makeNewCrewInit()
            crewList[s] = crew
            pp.Print(crewList)
            s.Write([]byte("AcceptEntry:"+strconv.Itoa(crew.crewid)))
            m.Broadcast([]byte("Join " + crew.name))
        }
        lock.Unlock()
    })

    m.HandleDisconnect(func(s *melody.Session) {
        log.Printf("Azure connection close. [session: %#v]\n", s)
    })

    router.Run(":55417")

    fmt.Println("Azure App End")
}

