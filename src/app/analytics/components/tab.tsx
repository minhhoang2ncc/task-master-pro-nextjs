import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import { Badge } from "@/shared/components/badge"

const colorMap: { [key: string]: string } = {
    blue: "border-b-blue-500",
    green: "border-b-green-500",
    red: "border-b-red-500",
    purple: "border-b-purple-500",
};

export function Tab({content}: {content: {title: string, value: number, icon: React.ReactNode, previousValue: number, color: string}}) {
    let valueRatio = 0;
    if (content.title.includes("Rate")){
        // valueRatio 
    }else {
        valueRatio = content.previousValue !== 0 ? ((content.value - content.previousValue) / content.previousValue) * 100 : 0;
    }
    return (
        <Card size="sm" className={`gap-0 border-b-4 ${colorMap[content.color] || 'border-b-gray-500'}`}>
            <CardHeader className="">
                <div className="flex justify-between">
                    {content.icon}
                    <Badge variant="secondary" className={valueRatio >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {valueRatio.toFixed(1)} {content.title.includes("Rate") ? "" : "%"}
                    </Badge>
                </div>
                <CardTitle className="text-sm">
                    {content.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="">
                <div className="text-lg font-bold p-0 m-0">
                    {content.value}
                </div>
            </CardContent>
        </Card>
    )
}