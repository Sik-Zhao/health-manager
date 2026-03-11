"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingData {
  name: string;
  gender: "male" | "female";
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  targetDate: string;
  activityLevel: number;
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    gender: "male",
    age: 30,
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    targetDate: "",
    activityLevel: 1.2,
  });

  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    if (data.gender === "male") {
      return 10 * data.currentWeight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      return 10 * data.currentWeight + 6.25 * data.height - 5 * data.age - 161;
    }
  };

  const calculateTDEE = () => {
    return calculateBMR() * data.activityLevel;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bmr = calculateBMR();
      const tdee = calculateTDEE();
      
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          bmr,
          tdee,
          dailyCalorie: tdee, // 初始以 TDEE 为目标
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setLoading(false);
    }
  };

  const activityLabels: Record<number, string> = {
    1.2: "久坐（基本不运动）",
    1.375: "轻度活动（每周运动 1-3 天）",
    1.55: "中度活动（每周运动 3-5 天）",
    1.725: "高度活动（每周运动 6-7 天）",
    1.9: "极高度活动（每天运动）",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          健康管理助手
        </h1>
        <p className="text-center text-gray-500 mb-8">
          让我们先了解一下您的基本情况
        </p>

        {/* Progress */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                您的昵称
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="请输入昵称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                性别
              </label>
              <div className="flex gap-4">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setData({ ...data, gender: g })}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      data.gender === g
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {g === "male" ? "👨 男" : "👩 女"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年龄: {data.age} 岁
              </label>
              <input
                type="range"
                min="15"
                max="80"
                value={data.age}
                onChange={(e) =>
                  setData({ ...data, age: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              下一步
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                身高: {data.height} cm
              </label>
              <input
                type="range"
                min="140"
                max="200"
                value={data.height}
                onChange={(e) =>
                  setData({ ...data, height: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                当前体重: {data.currentWeight} kg
              </label>
              <input
                type="range"
                min="40"
                max="150"
                value={data.currentWeight}
                onChange={(e) =>
                  setData({ ...data, currentWeight: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标体重: {data.targetWeight} kg
              </label>
              <input
                type="range"
                min="40"
                max="150"
                value={data.targetWeight}
                onChange={(e) =>
                  setData({ ...data, targetWeight: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标日期
              </label>
              <input
                type="date"
                value={data.targetDate}
                onChange={(e) =>
                  setData({ ...data, targetDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                活动水平
              </label>
              <div className="space-y-2">
                {Object.entries(activityLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() =>
                      setData({ ...data, activityLevel: Number(value) })
                    }
                    className={`w-full py-2 px-4 rounded-lg text-left text-sm transition ${
                      data.activityLevel === Number(value)
                        ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Calories */}
            <div className="bg-indigo-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-indigo-600 mb-1">预计每日目标热量</p>
              <p className="text-2xl font-bold text-indigo-800">
                {Math.round(calculateTDEE())} kcal
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "提交中..." : "开始使用"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
