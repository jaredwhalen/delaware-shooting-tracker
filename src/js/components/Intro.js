export default function Intro() {

  let pList = document.querySelector('.article-inner') && document.querySelector('.article-inner').querySelectorAll('p:not(.g-p-project)')

  let pComponents = pList && Array.from(pList).map((p, i) => <p key={'p-'+i} className='g-p-project' dangerouslySetInnerHTML={{__html: p.innerHTML}}></p>)

  return(
    <>
      {pComponents || ''}
    </>
  )
}
