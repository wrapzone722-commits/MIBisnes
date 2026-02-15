import { useState, useEffect } from 'react'
import { CarCard } from './components/CarCard'
import { AddCarForm } from './components/AddCarForm'
import { Summary } from './components/Summary'
import { BottomNav } from './components/BottomNav'
import { HistoryView } from './components/HistoryView'
import { SettingsView } from './components/SettingsView'
import { ProfileView } from './components/ProfileView'
import { useSettings } from './context/SettingsContext'
import { useAuth } from './context/AuthContext'
import { loadCars, saveCars } from './storage'
import './App.css'

function formatDate(d) {
  const s = d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function App() {
  const { settings } = useSettings()
  const { user, canEdit } = useAuth()
  const [cars, setCars] = useState([])
  const [screen, setScreen] = useState('home')
  const [tab, setTab] = useState('all')

  useEffect(() => {
    setCars(loadCars())
  }, [])

  useEffect(() => {
    if (cars.length) saveCars(cars)
  }, [cars])

  const addCar = (brand, model, price, paymentType = 'cash', phone = '', image = null) => {
    setCars(prev => [...prev, {
      id: crypto.randomUUID(),
      brand: brand.trim(),
      model: model.trim(),
      price: Number(price) || 0,
      paymentType: paymentType === 'card' ? 'card' : 'cash',
      phone: (phone || '').trim(),
      image: image || null,
      date: new Date().toISOString().slice(0, 10),
      expenses: [],
    }])
  }

  const addExpense = (carId, amount, comment, contractor = '') => {
    setCars(prev => prev.map(car =>
      car.id === carId
        ? {
            ...car,
            expenses: [...car.expenses, {
              id: crypto.randomUUID(),
              amount: Number(amount) || 0,
              comment: (comment || '').trim(),
              contractor: (contractor || '').trim(),
              date: new Date().toISOString(),
            }],
          }
        : car
    ))
  }

  const removeExpense = (carId, expenseId) => {
    setCars(prev => prev.map(car =>
      car.id === carId
        ? { ...car, expenses: car.expenses.filter(e => e.id !== expenseId) }
        : car
    ))
  }

  const removeCar = (carId) => {
    if (confirm('Удалить авто и все расходы?')) setCars(prev => prev.filter(c => c.id !== carId))
  }

  const filteredCars = tab === 'all' ? cars : cars

  return (
    <div className="app">
      <header className="header">
        <div className="header__left">
          <h1>{settings.userName ? `Привет, ${settings.userName}!` : user ? `Привет, ${user.firstName}!` : 'Привет!'}</h1>
          <p>{formatDate(new Date())}{user && !settings.userName ? ` · ${user.username ? `@${user.username}` : ''}` : ''}</p>
        </div>
        <button type="button" className="header__menu" aria-label="Меню">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="5" width="18" height="2" rx="1"/>
            <rect x="3" y="11" width="18" height="2" rx="1"/>
            <rect x="3" y="17" width="18" height="2" rx="1"/>
          </svg>
        </button>
      </header>

      <main className="main">
        {/* Главная */}
        <section className={`screen ${screen === 'home' ? 'screen--active' : ''}`}>
          <Summary cars={cars} />
          <div className="tabs">
            <button type="button" className={`tab ${tab === 'all' ? 'tab--active' : ''}`} onClick={() => setTab('all')}>
              Все авто
            </button>
          </div>
          {canEdit && <AddCarForm onSubmit={addCar} />}
          <div className="cars">
            {filteredCars.map(car => (
              <CarCard
                key={car.id}
                car={car}
                canEdit={canEdit}
                onAddExpense={addExpense}
                onRemoveExpense={removeExpense}
                onRemoveCar={removeCar}
              />
            ))}
          </div>
        </section>

        {/* История */}
        <section className={`screen ${screen === 'history' ? 'screen--active' : ''}`}>
          <HistoryView cars={cars} />
        </section>

        {/* Настройки */}
        <section className={`screen ${screen === 'settings' ? 'screen--active' : ''}`}>
          <SettingsView cars={cars} onClearData={() => { setCars([]); saveCars([]) }} />
        </section>

        {/* Итоги */}
        <section className={`screen ${screen === 'profile' ? 'screen--active' : ''}`}>
          <ProfileView cars={cars} />
        </section>
      </main>

      <BottomNav active={screen} onChange={setScreen} />
    </div>
  )
}
