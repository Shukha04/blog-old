document.getElementById('openNav').addEventListener('change', () => {
  if (document.getElementById('openNav').checked) {
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.removeAttribute('style')
  }
})