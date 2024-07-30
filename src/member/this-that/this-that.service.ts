<script>
	import * as Avatar from '$lib/components/ui/avatar';
	import { session } from '$lib/stores/member.store';
</script>

<nav
	class="sticky top-0 flex w-full justify-between items-center bg-gradient-to-r from-black to-yellow-900 px-4 z-[1500]"
>
	<!-- Use a button for the logo navigation as well -->
	<button
		on:click={() => {
			window.location.replace('/menu');
		}}
		class="flex items-center"
	>
		<img src="/logo.svg" alt="logo" class="object-cover w-28" />
	</button>

	<!-- Use button for the user profile navigation -->
	<button
		on:click={() => {
			window.location.replace('/@me');
		}}
		class="flex items-center"
	>
		<Avatar.Root>
			<Avatar.Image src={$session.avatarURL} alt="@sairahut" />
			<Avatar.Fallback>IT</Avatar.Fallback>
		</Avatar.Root>
	</button>
</nav>
