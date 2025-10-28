"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, Check } from "lucide-react"

interface AppointmentPickerProps {
  onAppointmentSelected: (datetime: string) => void
  customerName?: string
}

export function AppointmentPicker({ onAppointmentSelected, customerName }: AppointmentPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Generate next 14 days (excluding weekends by default)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    let daysAdded = 0
    let currentDate = new Date(today)

    while (daysAdded < 14) {
      currentDate.setDate(currentDate.getDate() + 1)
      const dayOfWeek = currentDate.getDay()
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate))
        daysAdded++
      }
    }
    return dates
  }

  // Generate time slots (9:00 - 17:00, every 30 minutes)
  const getTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  const availableDates = getAvailableDates()
  const timeSlots = getTimeSlots()

  const formatDate = (date: Date) => {
    const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
  }

  const formatDateShort = (date: Date) => {
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    return `${date.getDate()} ${months[date.getMonth()]}`
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const datetime = `${selectedDate}T${selectedTime}:00`
      setIsConfirmed(true)
      onAppointmentSelected(datetime)
    }
  }

  const getSelectedDateFormatted = () => {
    if (!selectedDate) return ""
    const date = new Date(selectedDate + "T00:00:00")
    return formatDate(date)
  }

  if (isConfirmed) {
    return (
      <Card className="p-6 bg-green-50 border-2 border-green-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Afspraak Bevestigd! ✅</h3>
            <p className="text-sm text-gray-600">We sturen je een bevestigingsmail</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-gray-700 mb-2">
            <strong>📅 {getSelectedDateFormatted()}</strong>
          </p>
          <p className="text-gray-700">
            <strong>🕐 {selectedTime} uur</strong>
          </p>
          <p className="text-sm text-gray-600 mt-3">
            We bellen je op dit moment voor een gratis adviesgesprek!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#4285f4]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-[#4285f4] rounded-full flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Plan je Gratis Adviesgesprek</h3>
          <p className="text-sm text-gray-600">Kies een moment dat jou schikt</p>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          📅 Kies een datum
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {availableDates.slice(0, 10).map((date) => {
            const dateStr = date.toISOString().split('T')[0]
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(dateStr)
                  setSelectedTime("") // Reset time when date changes
                }}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  isSelected
                    ? 'border-[#4285f4] bg-blue-50 text-[#4285f4] font-bold'
                    : 'border-gray-200 hover:border-[#4285f4] text-gray-700'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {formatDate(date).split(' ')[0].slice(0, 2)}
                </div>
                <div className="font-bold">{formatDateShort(date)}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🕐 Kies een tijd
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    isSelected
                      ? 'border-[#4285f4] bg-blue-50 text-[#4285f4] font-bold'
                      : 'border-gray-200 hover:border-[#4285f4] text-gray-700'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Je afspraak:</strong><br />
            {getSelectedDateFormatted()} om {selectedTime} uur
          </p>
          <Button
            onClick={handleConfirm}
            className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold"
          >
            <Check className="w-5 h-5 mr-2" />
            Bevestig Afspraak
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">
        💡 We bellen je op het gekozen moment voor een vrijblijvend adviesgesprek
      </p>
    </Card>
  )
}

