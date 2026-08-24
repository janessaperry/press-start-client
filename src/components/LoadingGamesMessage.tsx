import { SwordIcon } from "@phosphor-icons/react";

const LoadingGamesMessage = () => {
  return (
    <div className="w-full p-4 flex flex-col items-center gap-6">
      <SwordIcon className="text-primary-100  icon-2xl -rotate-45 animate-swing"/>

      <div className="space-y-2 text-center">
        <h3 className="text-primary-100">Gearing up...</h3>
        <p className="text-secondary-100 text-lg">Searching for your next adventure.</p>
      </div>
    </div>
  )
}

export default LoadingGamesMessage;