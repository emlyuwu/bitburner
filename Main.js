/** @param {NS} ns */
export async function main(ns) {
  ns.tail()
  ns.killall(ns.getHostname())
  var target = ns.args[0]
  var weakentime = ns.getWeakenTime(target)
  var gsleep = weakentime - ns.getGrowTime(target) - 1000
  var hsleep = weakentime - ns.getHackTime(target) - 1000
  var totalsleep = weakentime + 5000
  // Runs "batchsort", a cobbled together batch organizer. 
  await ns.exec("batchsort.js", "home")
  ns.print(`${"\u001b[32m"}Batches handled.`)
  // ports write the intended target, the time for hack functions to sleep, and the time for grow functions to sleep.
  ns.clearPort(10)
  ns.clearPort(9)
  ns.clearPort(8)
  ns.writePort(10, target)
  ns.writePort(9, hsleep)
  ns.writePort(8, gsleep)
  while (1 > 0) {
    var weakentime = ns.getWeakenTime(target)
    var gsleep = weakentime - ns.getGrowTime(target) - 1000
    var hsleep = weakentime - ns.getHackTime(target) - 1000
    var totalsleep = weakentime + 5000
    var roundcash = Math.round(ns.getServerMoneyAvailable(target)/100000) /10
    var securitylevel = ns.getServerSecurityLevel(target)
    ns.print(`${"\u001b[37m"}Target = ${target}`)
    ns.print(`${"\u001b[37m"}Hack time = ${(totalsleep - hsleep)/1000} / ${securitylevel}`)
    ns.print(`${"\u001b[37m"}Grow time = ${(totalsleep - gsleep)/1000} / ${roundcash}M`)
    ns.print(`${"\u001b[37m"}Total time = ${(totalsleep / 1000)}`)
    ns.clearPort(11)
    ns.writePort(11, 1)
    await ns.sleep(totalsleep)
    ns.clearPort(11)
    ns.writePort(11, 0)
    // Waits 5 s to ensure functions run in sync
    await ns.sleep(5000)
  }
}
