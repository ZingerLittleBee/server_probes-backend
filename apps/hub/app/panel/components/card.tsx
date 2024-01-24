import { useMemo, type FC, type HTMLAttributes } from 'react'
import { type NetworkIO, type Record } from '@serverbee/types'
import {
    Bold,
    Card,
    CategoryBar,
    Divider,
    Flex,
    ProgressBar,
    ProgressCircle,
    SparkAreaChart,
    Text,
    Title,
    Tracker,
} from '@tremor/react'
import {
    Activity,
    ArrowDownCircle,
    ArrowUpCircle,
    Cpu,
    HardDrive,
    Info,
    MemoryStick,
    Network,
} from 'lucide-react'

import { formatToString, toGiB, toMiB } from '@/lib/unit'
import { cn } from '@/lib/utils'
import { STooltip } from '@/components/s-tooltip'

export type PanelCardProps = Record & {
    name: string
    networkHistory: NetworkIO[]
} & HTMLAttributes<HTMLDivElement>

export default function PanelCard({
    fusion,
    name,
    time,
    server_id,
    networkHistory,
    className,
}: PanelCardProps) {
    const overview = useMemo(() => fusion?.overview, [fusion?.overview])

    const memValues = useMemo(() => {
        const { used, total } = overview?.memory_usage ?? {}
        const usedNum = isNaN(parseInt(used?.[0])) ? 0 : parseInt(used[0])
        const totalNum = isNaN(parseInt(total?.[0])) ? 0 : parseInt(total[0])
        const percent = Math.round(
            totalNum === 0 ? 0 : (usedNum / totalNum) * 100
        )
        return [percent, 100 - percent]
    }, [overview?.memory_usage])

    const memory = useMemo(
        () => overview?.memory_usage,
        [overview?.memory_usage]
    )
    const network = useMemo(() => overview?.network_io, [overview?.network_io])
    const netHistory = useMemo(() => {
        return networkHistory.map(({ rx, tx }, index) => ({
            rx: toMiB(rx),
            tx: toMiB(tx),
            index,
        }))
    }, [networkHistory])
    const networkTotal = useMemo(() => {
        const network = networkHistory.at(-1)
        return [
            {
                key: 'Transmit',
                value: network?.tx ? formatToString(network?.tx) : 'N/A',
                color: InfoColorEnum.Violet,
            },
            {
                key: 'Receive',
                value: network?.rx ? formatToString(network?.rx) : 'N/A',
                color: InfoColorEnum.Green,
            },
        ]
    }, [networkHistory])

    const disk = useMemo(() => overview?.disk_io, [overview?.disk_io])
    const diskUsage = useMemo(
        () => overview?.disk_usage,
        [overview?.disk_usage]
    )

    const diskUsedPercent = useMemo(() => {
        const used = toGiB(diskUsage?.used)
        const total = toGiB(diskUsage?.total)

        return total === 0 ? 0 : Math.round((used / total) * 100)
    }, [diskUsage])

    const diskTotal = useMemo(() => {
        const diskIo = overview?.disk_io
        return [
            {
                key: 'Read',
                value: diskIo?.total_read
                    ? formatToString(diskIo?.total_read)
                    : 'N/A',
                color: InfoColorEnum.Teal,
            },
            {
                key: 'Write',
                value: diskIo?.total_write
                    ? formatToString(diskIo?.total_write)
                    : 'N/A',
                color: InfoColorEnum.Fuchsia,
            },
        ]
    }, [overview?.disk_io])

    return (
        <Card className={cn('w-[300px] space-y-4 p-4 pt-2', className)}>
            <div>
                <Title>{name}</Title>
                <Divider className="my-1" />
            </div>
            <Flex className="truncate" justifyContent="between">
                <Flex className="truncate" justifyContent="start">
                    <Text className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        <Bold>Load</Bold>
                    </Text>
                </Flex>
                <Text color="purple">
                    <STooltip content="1 min | 5 min | 15 min">
                        <Bold>{overview?.load_avg.join(' | ')}</Bold>
                    </STooltip>
                </Text>
            </Flex>
            <div className="flex flex-col gap-2">
                <Flex className="truncate" justifyContent="between">
                    <Flex className="truncate" justifyContent="start">
                        <Text className="flex items-center gap-1">
                            <Cpu className="h-4 w-4" />
                            <Bold>CPU</Bold>
                        </Text>
                    </Flex>
                    <Text color="indigo">
                        <Bold>{overview?.cpu_usage}%</Bold>
                    </Text>
                </Flex>
                <ProgressBar
                    color="indigo"
                    showAnimation={true}
                    value={parseInt(overview?.cpu_usage ?? '0')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Flex className="gap-4 truncate" justifyContent="between">
                    <Flex className="truncate" justifyContent="start">
                        <Text className="flex items-center gap-1">
                            <MemoryStick className="h-4 w-4" />
                            <Bold>Mem</Bold>
                        </Text>
                    </Flex>
                    <STooltip content="Used">
                        <div className="flex items-center gap-1">
                            <div
                                className="
                                flex
                            h-4
                            w-4 items-center justify-center rounded-full border border-amber-200 text-[10px] font-bold text-amber-600 dark:border-amber-600 dark:text-amber-400"
                            >
                                U
                            </div>
                            <Text color="amber">
                                <Bold>
                                    {memory?.used
                                        ? formatToString(memory?.used)
                                        : 'N/A'}
                                </Bold>
                            </Text>
                        </div>
                    </STooltip>
                    <STooltip content="Total">
                        <div className="flex items-center gap-1">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-600 dark:border-emerald-600 dark:text-emerald-400">
                                T
                            </div>
                            <Text color="emerald">
                                <Bold>
                                    {memory?.used
                                        ? formatToString(memory?.total)
                                        : 'N/A'}
                                </Bold>
                            </Text>
                        </div>
                    </STooltip>
                </Flex>
                <CategoryBar
                    values={memValues}
                    colors={['amber', 'emerald']}
                    markerValue={memValues[0]}
                    showLabels={false}
                    showAnimation={true}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Flex className="truncate" justifyContent="between">
                    <Flex className="truncate" justifyContent="start">
                        <Text className="flex items-center gap-1">
                            <Network className="h-4 w-4" />
                            <Bold>Net</Bold>
                        </Text>
                        <InfoTooltip data={networkTotal} />
                    </Flex>
                    <div className="flex gap-2">
                        <Text
                            color="violet"
                            className="flex items-center gap-1 dark:text-violet-400"
                        >
                            <STooltip content="Transmit">
                                <ArrowUpCircle className="h-4 w-4" />
                            </STooltip>
                            <STooltip content="Transmit">
                                <Bold>
                                    {network?.tx
                                        ? formatToString(network?.tx)
                                        : 'N/A'}
                                </Bold>
                            </STooltip>
                        </Text>
                        <Text
                            color="green"
                            className="flex items-center gap-1
                            text-green-700 dark:text-green-500"
                        >
                            <STooltip content="Receive">
                                <ArrowDownCircle className="h-4 w-4" />
                            </STooltip>
                            <STooltip content="Receive">
                                <Bold>
                                    {network?.rx
                                        ? formatToString(network?.rx)
                                        : 'N/A'}
                                </Bold>
                            </STooltip>
                        </Text>
                    </div>
                </Flex>
                <Flex className="gap-4">
                    <SparkAreaChart
                        data={netHistory}
                        categories={['rx', 'tx']}
                        index={'index'}
                        colors={['emerald', 'violet']}
                        className="h-12 w-full"
                    />
                </Flex>
            </div>
            <div
                className="flex flex-col gap-2"
                style={{
                    marginTop: '0',
                }}
            >
                <Flex className="gap-4 truncate" justifyContent="between">
                    <Flex className="truncate" justifyContent="start">
                        <Text className="flex items-center gap-1">
                            <HardDrive className="h-4 w-4" />
                            <Bold>Disk</Bold>
                        </Text>
                        <InfoTooltip data={diskTotal} />
                    </Flex>
                    <div className="flex gap-2">
                        <div className="flex items-center justify-center space-x-2">
                            <Tracker
                                data={[{ color: 'cyan', tooltip: 'Read' }]}
                                className="flex h-3 w-2 items-center justify-center"
                            />
                            <Text color="cyan">
                                {disk?.read
                                    ? formatToString(disk?.read)
                                    : 'N/A'}
                            </Text>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <Tracker
                                data={[{ color: 'fuchsia', tooltip: 'Write' }]}
                                className="flex h-3 w-2 items-center justify-center"
                            />
                            <Text color="fuchsia">
                                {disk?.write
                                    ? formatToString(disk?.write)
                                    : 'N/A'}
                            </Text>
                        </div>
                    </div>
                    <ProgressCircle
                        value={diskUsedPercent}
                        radius={20}
                        strokeWidth={4}
                        tooltip={`Used: ${formatToString(
                            diskUsage?.used
                        )}, Total: ${formatToString(diskUsage?.total)}`}
                    >
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {diskUsedPercent}%
                        </span>
                    </ProgressCircle>
                </Flex>
            </div>
        </Card>
    )
}

enum InfoColorEnum {
    Violet = 'bg-[#8b5cf6]',
    Green = 'bg-[#22c55e]',
    Teal = 'bg-[#14b8a6]',
    Fuchsia = 'bg-[#d946ef]',
}

const InfoTooltip: FC<{
    data: { key: string; value: string; color: InfoColorEnum }[]
}> = ({ data }) => {
    return (
        <STooltip
            content={
                <div>
                    <Text className="mx-2">Total Usage</Text>
                    <div className="bg-muted my-1 w-full border" />
                    {data?.map(({ key, value, color }) => (
                        <div
                            key={key}
                            className="mx-2 flex flex-row items-center space-x-2"
                        >
                            <div
                                className={`h-2 w-2 rounded-full ${color}`}
                            ></div>
                            <Flex alignItems="center" className="gap-1">
                                <Text>{key}</Text>
                                <Bold>{value}</Bold>
                            </Flex>
                        </div>
                    ))}
                </div>
            }
            className="px-0"
        >
            <Info className="h-3 w-3 self-start text-slate-500" />
        </STooltip>
    )
}