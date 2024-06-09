import { ReactComponent as NoDataSvg } from './no_data.svg'

const NoData = () => {
    return (
        <div className="flex flex-col w-full h-full justify-center items-center pb-[20%]">
            <NoDataSvg />
            <div className="text-gray-400 text-[22px] font-semibold">
                No data to display
            </div>
        </div>
    )
}

export default NoData
