import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Timer, UserSquare} from "lucide-react";
import {Icons} from "@/components/icons";
import {useStore} from "@/store";
import {Skeleton} from "@/components/ui/skeleton";
import {unix} from "dayjs";

export const OsWidget = () => {
    const {fusion} = useStore()
    const os = fusion?.os

    return (
        <div className="flex justify-between space-x-4 my-1">
            <div className="flex space-x-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <UserSquare size={16}/>
                                {
                                    os?.hostname ? <p>{os?.hostname}</p> : <Skeleton className="h-5 w-[100px]"/>
                                }
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Hostname</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Icons.os className="w-[16px] fill-muted-foreground"/>
                                {
                                    os?.os_version ? <p>{os?.os_version}</p> : <Skeleton className="h-5 w-[100px]"/>
                                }
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>OS</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild className="">

                        <div className="flex justify-end items-center space-x-2 text-sm text-muted-foreground">
                            <Timer size={16}/>
                            {
                                os?.boot_time ? <p>{unix(os?.boot_time).format('YYYY-MM-DD HH:mm:ss')}</p> :
                                    <Skeleton className="h-5 w-[100px]"/>
                            }
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Boot Time</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}