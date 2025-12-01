import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { emotions, intensityLevels, tags } from "@/config"
import { useToast } from "@/components/ui/use-toast"
import { createEmotion } from "@/services/emotionServices"


export default function ShareEmotionPage() {
    const [selectedEmotion, setSelectedEmotion] = useState("happy")
    const [intensity, setIntensity] = useState(3)
    const [description, setDescription] = useState("")
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [submitted, setSubmitted] = useState(false)
    const { toast } = useToast()

    const descriptionSuggestions = [
        "Tôi vừa chia tay người yêu và thấy rất trống trải.",
        "Tôi mới trúng số và cảm thấy cực kỳ phấn khích.",
        "Tôi gặp khó khăn trong công việc và đang lo lắng.",
        "Tôi có một ngày thư giãn tuyệt vời cùng gia đình.",
    ]

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    }

    const handleSubmit = async () => {
        if (submitted) return

        setSubmitted(true)

        try {
            await createEmotion({
                emotion: selectedEmotion,
                intensity,
                description: description.trim() ? description.trim() : undefined,
                tags: selectedTags.length ? selectedTags : undefined,
                emoji: currentEmotion?.emoji,
            })

            toast({
                title: "Ghi nhận cảm xúc thành công",
                description: "Cảm xúc của bạn đã được lưu lại.",
            })

            setDescription("")
            setSelectedTags([])
            setIntensity(3)
        } catch (error) {
            const errorMessage =
                (typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as any).response?.data?.msg === "string" &&
                    (error as any).response.data.msg) ||
                "Không thể ghi nhận cảm xúc, vui lòng thử lại."

            toast({
                variant: "destructive",
                title: "Ghi nhận thất bại",
                description: errorMessage,
            })
        } finally {
            setSubmitted(false)
        }
    }

    const currentEmotion = emotions.find((e) => e.value === selectedEmotion)

    return (
        <div className="max-w-2xl mx-auto space-y-6 lg:space-y-8 px-3 sm:px-0">

            {/* Emotion Selection */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Bạn đang cảm thấy như thế nào?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {emotions.map((emotion) => (
                        <button
                            key={emotion.value}
                            onClick={() => setSelectedEmotion(emotion.value)}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedEmotion === emotion.value
                                    ? `${emotion.color} ring-2 ring-primary scale-105`
                                    : `${emotion.color} opacity-60 hover:opacity-100`
                                }`}
                            title={emotion.label}
                        >
                            <div className="text-4xl mb-2 text-center">{emotion.emoji}</div>
                            <div className="text-xs font-medium text-center text-foreground">{emotion.label}</div>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Intensity Slider */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Mức độ cảm xúc</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {intensityLevels.map((level) => (
                            <button
                                key={level.level}
                                onClick={() => setIntensity(level.level)}
                                className={`flex-1 py-3 cursor-pointer rounded-lg font-medium transition-all ${intensity === level.level
                                        ? `${level.color} text-white scale-105`
                                        : `${level.color} opacity-30 hover:opacity-50`
                                    }`}
                            >
                                {level.level}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        Mức độ hiện tại: {intensityLevels.find((l) => l.level === intensity)?.label}
                    </p>
                </div>
            </Card>

            {/* Tags */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Nguyên nhân liên quan (tùy chọn)</h2>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Description */}
            <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Mô tả chi tiết (tùy chọn)</h2>
                <Textarea
                    placeholder="Hãy chia sẻ những gì bạn đang cảm thấy... Điều gì đã gây ra cảm xúc này? Bạn muốn nói gì?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[150px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">{description.length} / 1000 ký tự</p>
                <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Gợi ý nhanh:</p>
                    <div className="flex flex-wrap gap-2">
                        {descriptionSuggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => setDescription(suggestion)}
                                className="px-3 py-2 text-xs cursor-pointer rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Summary */}
            {currentEmotion && (
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Tóm tắt cảm xúc của bạn</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 text-center sm:text-left">
                        <div className="text-6xl">{currentEmotion.emoji}</div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cảm xúc:</p>
                            <p className="text-2xl font-bold text-foreground">{currentEmotion.label}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Mức độ: {intensityLevels.find((l) => l.level === intensity)?.label}
                            </p>
                        </div>
                    </div>
                    {selectedTags.length > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Liên quan đến:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map((tag) => (
                                    <span key={tag} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={handleSubmit}
                    disabled={submitted}
                    className="flex-1 bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-medium py-3"
                >
                    {submitted ? "Đang ghi lại..." : "Ghi lại cảm xúc"}
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                        setDescription("")
                        setSelectedTags([])
                        setIntensity(3)
                    }}
                >
                    Xóa
                </Button>
            </div>

            {/* Support Message */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-foreground">
                    💡 <strong>Mẹo:</strong> Ghi lại cảm xúc của bạn thường xuyên giúp bạn nhận ra các mô hình và kích hoạt cảm
                    xúc, từ đó cải thiện sức khỏe tâm lý của mình.
                </p>
            </div>
        </div>
    )
}

