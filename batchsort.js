/** @param {NS} ns */
export async function main(ns) {
  ns.writePort(11, 0)
  // Targets will be issued via port 10. Just going to be issued as a string.
  // Host assignments will be issued at execution. execute hack, grow, or weaken respectively.
  // Port 11 controls whether the functions run or not. All functions wait for port 11 to return 1
  
  // Sleep periods for each batch will be issued across port 9(hack) and 8(grow).
  // Weaken is not given a sleep time because it should be the longest
  // running function, and should end with the sleep functions.

  // Combines "natural" servers with purchased servers for complete batch sorting.
  var allthreads = 0
  const natserv = ["n00dles", "foodnstuff",
    "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi", "neo-net", "zer0", "max-hardware", "iron-gym", "phantasy", "silver-helix",
    "crush-fitness", "johnson-ortho", "the-hub", "computek", "rothman-uni", "catalyst", "summit-uni", "rho-construction", "millenium-fitness", "aevum-police",
    "alpha-ent", "syscore", "lexo-corp", "snap-fitness", "global-pharm", "applied-energetics", "unitalife", "univ-energy", "nova-med", "zb-def",
    "zb-institute", "vitalife", "titan-labs", "solaris", "microdyne", "helios", "deltaone", "icarus", "zeus-med", "omnia", "defcomm", "galactic-cyber",
    "infocomm", "taiyang-digital", "stormtech", "aerocorp", "clarkinc", "omnitek", "nwo", "4sigma", "blade", "b-and-a", "ecorp", "fulcrumtech", "megacorp",
    "kuai-gong", "fulcrumassets", "powerhouse-fitness", "CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z",
    ".", "icarus",];
  const purchservers = ns.getPurchasedServers()
  const servers = natserv.concat(purchservers)

  // Calculates max thread count. 
  for (const each in servers) {
    if (ns.hasRootAccess(servers[each]) == true) {
      var host = (servers[each])
      ns.killall(host)
      var hostthread = Math.floor(ns.getServerMaxRam(host) / 1.75)
      var allthreads = allthreads + hostthread
      ns.tprint(host)
    }
  }
  ns.tprint("Threads calculated!")
  ns.tprint(`${allthreads} threads available among all servers.`)
  const roundthread = Math.floor(allthreads / 3)
  ns.tprint(`Roughly ${roundthread} threads will be tasked with each batch function.`)
  
  // THIS IS THE LARGEST CURRENT ISSUE!!!!!
  // How do I find the correct ratio of grow-hack-weaken threads based on the grow factor of servers?
  // Is there a perfect formula to calculate such a ratio?
  var weakt = Math.floor(3 * allthreads / 10)
  var growt = Math.floor(3 * allthreads / 10)
  var hackt = Math.floor(4 * allthreads / 10)
  // Executes function script for each batch. Servers with less than 2 gb will be ignored. 
  for (const each in servers) {
    var host = (servers[each])
    ns.killall(host)
    ns.scp("scripts/grow.js", host, "home")
    ns.scp("scripts/hack.js", host, "home")
    ns.scp("scripts/weak.js", host, "home")
    // Gains root access on a server if possible
    if (ns.getServerMaxRam(host) > 2) {
      var openports = 0
      if (ns.hasRootAccess(host) == false) {
        if (ns.fileExists("brutessh.exe", "home")) {
          ns.brutessh(host)
          var openports = openports + 1
        }
        if (ns.fileExists("ftpcrack.exe", "home")) {
          ns.ftpcrack(host)
          var openports = openports + 1
        }
        if (ns.fileExists("relaysmtp.exe", "home")) {
          ns.relaysmtp(host)
          var openports = openports + 1
        }
        if (ns.fileExists("httpworm.exe", "home")) {
          ns.httpworm(host)
          var openports = openports + 1
        }
        if (ns.fileExists("SQLinject.exe", "home")) {
          ns.sqlinject(host)
          var openports = openports + 1
        }
        if (openports >= ns.getServerNumPortsRequired(host)) {
          ns.nuke(host)
        }
      }
      // assigns threads count for each server
      // Fills batch roles 
      var localthreads = Math.floor((ns.getServerMaxRam(host)) / 1.75)

      // I am well aware that this is some spaghetti code, but it works for now. Does what I need it to.
      if (localthreads > 0) {
        if (weakt > 0) {
          if (weakt >= localthreads) {
            await ns.exec("scripts/weak.js", host, localthreads, localthreads)
            var weakt = weakt - localthreads
            var localthreads = 0
          }
          else if (weakt < localthreads) {
            await ns.exec("scripts/weak.js", host, weakt, weakt)
            var localthreads = localthreads - weakt
            var weakt = 0
          }
        }
      }
      if (localthreads > 0) {
        if (hackt > 0) {
          if (hackt >= localthreads) {
            await ns.exec("scripts/hack.js", host, localthreads, localthreads)
            var hackt = hackt - localthreads
            var localthreads = 0
          }
          else if (hackt < localthreads) {
            await ns.exec("scripts/hack.js", host, hackt, hackt)
            var localthreads = localthreads - hackt
            var hackt = 0
          }
        }
      }
      if (localthreads > 0) {
        if (growt > 0) {
          if (growt - localthreads >= 0) {
            await ns.exec("scripts/grow.js", host, localthreads, localthreads)
            var growt = growt - localthreads
            var localthreads = 0
          }
          else if (growt < localthreads) {
            await ns.exec("scripts/grow.js", host, growt, growt)
            var localthreads = localthreads - growt
            var growt = 0
          }
        }
      }
    }
    else {
      ns.print(`${host} is not able to run the injected program.`)
      await ns.sleep(10)
    }
  }
}
