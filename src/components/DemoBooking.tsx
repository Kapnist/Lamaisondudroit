import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CalendarDays, CheckCircle2, Clock3, Smartphone, TriangleAlert } from 'lucide-react'
import { getDemoReservations, saveDemoReservation } from '../data/demoReservations'
import type { DemoPaymentMethod, DemoReservation } from '../data/demoReservations'

const appointmentTimes = ['09:00', '10:30', '14:00', '15:30']
const maximumBookingDays = 30

function toLocalDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatAppointmentDate(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  return new Intl.DateTimeFormat('fr-CM', {
    dateStyle: 'full',
    timeZone: 'Africa/Douala',
  }).format(new Date(year, month - 1, day))
}

function isWeekend(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const weekday = new Date(year, month - 1, day).getDay()
  return weekday === 0 || weekday === 6
}

export function DemoBooking() {
  const today = useMemo(() => new Date(), [])
  const minimumDate = toLocalDateInputValue(today)
  const maximumDate = useMemo(() => {
    const lastDate = new Date(today)
    lastDate.setDate(lastDate.getDate() + maximumBookingDays)
    return toLocalDateInputValue(lastDate)
  }, [today])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<DemoPaymentMethod>('mtn')
  const [reservations, setReservations] = useState<DemoReservation[]>([])
  const [confirmedReservation, setConfirmedReservation] = useState<DemoReservation | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    try {
      setReservations(getDemoReservations())
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de lire les réservations de démonstration.')
    }
  }, [])

  const availableTimes = selectedDate && !isWeekend(selectedDate)
    ? appointmentTimes.filter((time) =>
        !reservations.some((reservation) => reservation.date === selectedDate && reservation.time === time),
      )
    : []

  function handleDateChange(date: string) {
    setSelectedDate(date)
    setSelectedTime('')
    setConfirmedReservation(null)
    setErrorMessage('')
  }

  function confirmDemoReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    if (!selectedDate || !selectedTime || !paymentMethod) {
      setErrorMessage('Choisissez une date, un horaire et un moyen de paiement de démonstration.')
      return
    }

    if (selectedDate < minimumDate || selectedDate > maximumDate || isWeekend(selectedDate)) {
      setErrorMessage('Choisissez un jour ouvré disponible dans les 30 prochains jours.')
      return
    }

    const reservation: DemoReservation = {
      date: selectedDate,
      time: selectedTime,
      paymentMethod,
      reference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    }

    try {
      const saved = saveDemoReservation(reservation)
      if (!saved) {
        const latestReservations = getDemoReservations()
        setReservations(latestReservations)
        setSelectedTime('')
        setErrorMessage('Ce créneau vient d’être réservé dans cette démonstration. Choisissez-en un autre.')
        return
      }
      setReservations((current) => [...current, reservation])
      setConfirmedReservation(reservation)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible d’enregistrer la réservation de démonstration.')
    }
  }

  if (confirmedReservation) {
    return (
      <section className="demo-booking" id="reservation-demo" aria-labelledby="demo-booking-title">
        <div className="demo-booking__heading">
          <CheckCircle2 size={23} />
          <div>
            <span className="eyebrow">Confirmation de démonstration</span>
            <h2 id="demo-booking-title">Réservation simulée</h2>
          </div>
        </div>
        <p className="demo-booking__success" role="status">
          Votre créneau du {formatAppointmentDate(confirmedReservation.date)} à {confirmedReservation.time} est réservé dans cette démonstration.
        </p>
        <dl className="demo-booking__receipt">
          <div><dt>Mode de paiement choisi</dt><dd>{confirmedReservation.paymentMethod === 'mtn' ? 'MTN Mobile Money' : 'Orange Money'} · simulation</dd></div>
          <div><dt>Montant simulé</dt><dd>10 000 FCFA · aucun débit</dd></div>
          <div><dt>Référence de démonstration</dt><dd>{confirmedReservation.reference}</dd></div>
        </dl>
        <button className="button button--outline" type="button" onClick={() => setConfirmedReservation(null)}>
          Réserver un autre créneau de démonstration
        </button>
      </section>
    )
  }

  return (
    <section className="demo-booking" id="reservation-demo" aria-labelledby="demo-booking-title">
      <div className="demo-booking__heading">
        <CalendarDays size={23} />
        <div>
          <span className="eyebrow">Parcours interactif</span>
          <h2 id="demo-booking-title">Réserver une consultation — démonstration</h2>
        </div>
      </div>

      <div className="demo-booking__notice" role="note">
        <TriangleAlert size={19} />
        <p>
          Simulation uniquement : aucun paiement MTN ou Orange n’est envoyé, aucun compte Mobile Money n’est contacté et aucun montant n’est débité. Aucun numéro de téléphone n’est demandé. Le créneau et la référence sont enregistrés dans ce navigateur seulement.
        </p>
      </div>

      <form className="demo-booking__form" onSubmit={confirmDemoReservation}>
        <label className="demo-booking__field" htmlFor="demo-booking-date">
          <span>1. Choisissez une date</span>
          <input
            id="demo-booking-date"
            type="date"
            min={minimumDate}
            max={maximumDate}
            value={selectedDate}
            onChange={(event) => handleDateChange(event.target.value)}
            required
            aria-describedby="demo-booking-date-help"
          />
          <small id="demo-booking-date-help">Créneaux du lundi au vendredi, dans les 30 prochains jours.</small>
        </label>

        {selectedDate && (
          <fieldset className="demo-booking__times">
            <legend>2. Choisissez un horaire — consultation de 45 minutes</legend>
            {isWeekend(selectedDate) ? (
              <p className="demo-booking__hint">Aucun créneau de démonstration n’est proposé le week-end.</p>
            ) : availableTimes.length > 0 ? (
              <div className="demo-booking__time-options">
                {availableTimes.map((time) => (
                  <label className={selectedTime === time ? 'demo-booking__time demo-booking__time--selected' : 'demo-booking__time'} key={time}>
                    <input
                      type="radio"
                      name="demo-booking-time"
                      value={time}
                      checked={selectedTime === time}
                      onChange={() => setSelectedTime(time)}
                      required
                    />
                    <Clock3 size={15} /> {time}
                  </label>
                ))}
              </div>
            ) : (
              <p className="demo-booking__hint">Tous les créneaux de démonstration de cette date sont déjà pris.</p>
            )}
          </fieldset>
        )}

        <fieldset className="demo-booking__payments">
          <legend>3. Choisissez un mode de paiement simulé</legend>
          <label className={paymentMethod === 'mtn' ? 'demo-booking__payment demo-booking__payment--selected' : 'demo-booking__payment'}>
            <input
              type="radio"
              name="demo-payment-method"
              value="mtn"
              checked={paymentMethod === 'mtn'}
              onChange={() => setPaymentMethod('mtn')}
            />
            <Smartphone size={18} />
            <span><strong>MTN Mobile Money</strong><small>Mode démonstration uniquement</small></span>
          </label>
          <label className={paymentMethod === 'orange' ? 'demo-booking__payment demo-booking__payment--selected' : 'demo-booking__payment'}>
            <input
              type="radio"
              name="demo-payment-method"
              value="orange"
              checked={paymentMethod === 'orange'}
              onChange={() => setPaymentMethod('orange')}
            />
            <Smartphone size={18} />
            <span><strong>Orange Money</strong><small>Mode démonstration uniquement</small></span>
          </label>
        </fieldset>

        {errorMessage && <p className="demo-booking__error" role="alert">{errorMessage}</p>}

        <div className="demo-booking__summary">
          <span>Premier entretien · 45 min</span>
          <strong>10 000 FCFA <small>(montant simulé)</small></strong>
        </div>
        <button className="button button--nav demo-booking__submit" type="submit" disabled={!selectedDate || !selectedTime}>
          Simuler le paiement et confirmer
        </button>
      </form>
    </section>
  )
}
