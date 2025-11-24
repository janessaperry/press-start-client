const InfoChipList = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {data.map(item => {
        return <p key={item.id}
          className="py-1 px-2 text-base leading-none text-grey-50 border border-primary-300 rounded-full"
          id={item.id}>{item.abbreviation}</p>
      })}
    </div>
  )
}

export default InfoChipList;