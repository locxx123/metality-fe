const emotions = [
  { emoji: "😊", label: "Vui vẻ", value: "happy", color: "bg-yellow-100 dark:bg-yellow-900" },
  { emoji: "😔", label: "Buồn", value: "sad", color: "bg-blue-100 dark:bg-blue-900" },
  { emoji: "😰", label: "Lo lắng", value: "anxious", color: "bg-orange-100 dark:bg-orange-900" },
  { emoji: "😠", label: "Tức giận", value: "angry", color: "bg-red-100 dark:bg-red-900" },
  { emoji: "😴", label: "Mệt mỏi", value: "tired", color: "bg-purple-100 dark:bg-purple-900" },
  { emoji: "😌", label: "Bình tĩnh", value: "calm", color: "bg-green-100 dark:bg-green-900" },
  { emoji: "😍", label: "Yêu thích", value: "loved", color: "bg-pink-100 dark:bg-pink-900" },
  { emoji: "😕", label: "Bối rối", value: "confused", color: "bg-indigo-100 dark:bg-indigo-900" },
]

const intensityLevels = [
  { level: 1, label: "Rất nhẹ", color: "bg-green-500" },
  { level: 2, label: "Nhẹ", color: "bg-cyan-500" },
  { level: 3, label: "Trung bình", color: "bg-yellow-500" },
  { level: 4, label: "Nặng", color: "bg-orange-500" },
  { level: 5, label: "Rất nặng", color: "bg-red-500" },
]

const tags = ["Công việc", "Gia đình", "Học tập", "Sức khỏe", "Quan hệ", "Tài chính", "Xã hội"]

export { emotions, intensityLevels, tags }