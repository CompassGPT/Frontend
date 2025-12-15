const profileData = {
	name: "John Placeholder",
	username: "john.placeholder",
	email: "j.placeholder@example.test",
};

const favouriteModules = [
	"Mensgericht ontwerpen",
	"Molecular Modeling & Data-driven Analysis",
];

const recommendedModules = [
	"Technologie in zorg en welzijn",
	"App-development",
	"Bioinformatica",
];

const getInitials = (fullName: string) =>
	fullName
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("") || "?";

export default function ProfilePage() {
	return (
		<div className="min-h-screen bg-white text-gray-900">
			<main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16 pt-12 lg:gap-12">
				<section className="grid gap-6 md:grid-cols-2 lg:[grid-template-columns:1fr_1.4fr]">
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-gray-200">
						<div className="flex flex-col items-center gap-4">
							<div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 text-6xl font-semibold text-gray-500">
								{getInitials(profileData.name)}
							</div>
							<div className="text-center">
								<p className="text-lg font-semibold">{profileData.name}</p>
							</div>
							<button
								className="rounded-full border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
								aria-label="Profielfoto toevoegen"
						>
								Profielfoto toevoegen
							</button>
						</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-gray-200">
						<div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
							<h2 className="text-xl font-semibold text-gray-900">Gegevens</h2>
							<button className="h-10 rounded-full bg-gray-900 px-4 text-sm font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-300">
								Logout
							</button>
						</div>

						<div className="mt-6 space-y-6">
							<div>
								<p className="text-sm font-medium text-gray-500">Gebruikersnaam</p>
								<p className="mt-1 text-base font-semibold text-gray-900">{profileData.username}</p>
								<button className="mt-2 rounded-full border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300">
									Verander Gebruikersnaam
								</button>
							</div>

							<div>
								<p className="text-sm font-medium text-gray-500">E-mailadres</p>
								<p className="mt-1 text-base font-semibold text-gray-900">{profileData.email}</p>
								<button className="mt-2 rounded-full border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300">
									Verander E-mailadres
								</button>
							</div>

							<div className="pt-2">
								<button className="rounded-full border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200">
									Account verwijderen
								</button>
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-6 md:grid-cols-2">
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-gray-200">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900">Favoriete Modules</h3>
						</div>
						<div className="mt-5 space-y-3">
							{favouriteModules.map((module) => (
								<div
									key={module}
									className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-gray-200 hover:bg-gray-100"
								>
									<p className="text-sm font-medium text-gray-900" title={module}>
										{module}
									</p>
									<div className="flex items-center gap-3">
										<button className="rounded-full border border-gray-900 px-3 py-1 text-xs font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300">
											Ga naar module
										</button>
										<button className="rounded-full border border-red-500 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200">
											Verwijder
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-gray-200">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900">Recent aanbevolen modules</h3>
							<button className="rounded-full border border-gray-900 px-3 py-1 text-xs font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300">
								Aanpassen
							</button>
						</div>
						<div className="mt-5 space-y-3">
							{recommendedModules.map((module) => (
								<div
									key={module}
									className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-gray-200 hover:bg-gray-100"
								>
									<p className="text-sm font-medium text-gray-900" title={module}>
										{module}
									</p>
									<button className="rounded-full border border-gray-900 px-3 py-1 text-xs font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300">
										Ga naar module
									</button>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
