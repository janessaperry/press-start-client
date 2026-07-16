import { Button, Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  className?: string;
}

const SearchGamesInput = ({ className }: Props) => {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ searchQuery, setSearchQuery ] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    setSearchQuery(searchParams.get('search') ?? '');
  }, [ searchParams ]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('search', searchQuery);
    params.delete('page');
    setSearchParams(params);
  }

  return (
    <search className={className}>
      <div className="w-full md:max-w-3/4 lg:max-w-1/2 flex flex-col gap-3">
        <form className="flex items-stretch gap-3" onSubmit={handleSearchSubmit}>
          <Input
            name="search"
            type="search"
            placeholder="Search..."
            autoComplete="off"
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="grow md:text-xl"
          />
          <Button type="submit" className="button primary aspect-square rounded-full">
            <MagnifyingGlassIcon className="icon-md"/>
          </Button>
        </form>
      </div>
    </search>
  )
}

export default SearchGamesInput;