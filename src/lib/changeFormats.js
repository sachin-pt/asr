import sox from 'sox'
module.exports = (inputFile, outputFile, cb) => {
  sox.identify(inputFile, function (err, results) {
    var job = sox.transcode(inputFile, outputFile, {
      sampleRate: results.sampleRate,
      format: 'wav',
      channelCount: results.channelCount,
      bitRate: results.bitRate// see `man soxformat` search for '-C' for more info
    })
    job.on('error', function (err) {
    //   console.error(err)
    })
    job.on('progress', function (amountDone, amountTotal) {
    //   console.log('progress', amountDone, amountTotal)
    })
    job.on('src', function (info) {
    //   console.log(info)
    /* info looks like:
    {
      format: 'wav',
      duration: 1.5,
      sampleCount: 66150,
      channelCount: 1,
      bitRate: 722944,
      sampleRate: 44100,
    }
    */
    })
    job.on('dest', function (info) {
    //   console.log(info)
    /* info looks like:
    {
      sampleRate: 44100,
      format: 'mp3',
      channelCount: 2,
      sampleCount: 67958,
      duration: 1.540998,
      bitRate: 196608,
    }
    */
    })
    job.on('end', function () {
      cb()
    })
    job.start()
  })
}
