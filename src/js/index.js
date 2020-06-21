const $form = document.querySelector('.url-form')
const $spinner = document.querySelector('.u-spinner')
const $urlResults = document.querySelector('.url-results')

$form.onsubmit = async function(e){
  $form.classList.remove('url-form--error')

  e.preventDefault()
  const $urlInput = document.querySelector('#shorterInput')
  const url = $urlInput.value

  if (url === ''){
    $form.classList.add('url-form--error')
    setTimeout(() => {
      $form.classList.remove('url-form--error')
    }, 4000)
    return
  }

  $spinner.style.display = 'block'

  const shortUrl = await getShorterUrl(url)

  showResponse(url, shortUrl)
  $urlInput.value = ''
}

async function getShorterUrl(url){
  const baseUrl = 'https://rel.ink/'

  const res = await fetch('https://rel.ink/api/links/', {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "url": url
    })
  })
  const data = await res.json()

  return baseUrl + data.hashid
}

function showResponse(url, shortUrl) {
  $spinner.style.display = 'none'

  const allResults = `
    <article class="url-result">
      <p class="origin-url">${url}</p>
      <div class="result">
        <a class="result-url" href=${shortUrl} target="_blank">${shortUrl}</a>
        <button class="u-button u-button--square">Copy</button>
      </div>
    </article>
    ${$urlResults.innerHTML}
  `

  $urlResults.innerHTML = allResults

  activateCopyLinks()
}

function activateCopyLinks() {
  const $copyLinkButtons = $urlResults.querySelectorAll('.u-button')

  $copyLinkButtons.forEach($copyLink => {
    $copyLink.addEventListener('click', e => {
      const linkText = e.path[1].children[0].text

      const copied = copyTextToClipBoard(linkText)
      if(copied){
        e.target.style.backgroundColor = 'var(--violet)'
        e.target.textContent = 'Copied!'
      }
    })
  })
}

function copyTextToClipBoard(text){
  const textArea = document.createElement("textarea")
  textArea.value = text

  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')

  document.body.removeChild(textArea)

  return true
}



