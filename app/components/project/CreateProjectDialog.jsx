"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
	DialogClose,
} from "../ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@/context/UserContext";

export default function CreateProjectDialog({ open, onOpenChange, onCreate }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [targetMarket, setTargetMarket] = useState("");
	const [status, setStatus] = useState("idea");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const user = useUser();

	const reset = () => {
		setName("");
		setDescription("");
		setTargetMarket("");
		setStatus("idea");
		setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Project name is required");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				user_id: user.id,
				name: name.trim(),
				description: description.trim() || null,
				target_market: targetMarket.trim() || null,
				status,
				created_at: new Date().toISOString(),
			};

			// Try to insert into supabase projects table. If supabase is not configured,
			// the call will fail and we fall back to returning the local payload.
			const { data, error: insertError } = await supabase
				.from("projects")
				.insert([payload])
				.select()
				.single();

			if (insertError) {
				console.error("Supabase insert error:", insertError);
				// fallback: construct a local project object
				const localProject = { id: Date.now(), ...payload };
				onCreate && onCreate(localProject);
				reset();
				return;
			}

			onCreate && onCreate(data);
			reset();
		} catch (err) {
			console.error(err);
			setError(String(err));
		} finally {
			setLoading(false);
			onOpenChange && onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
					<DialogDescription>
						Add a new project to start building. Only Project Name
						is required.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="grid gap-4 mt-2">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Project Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full rounded-md border px-3 py-2 bg-white text-slate-900"
							placeholder="My Great SaaS"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full rounded-md border px-3 py-2 bg-white text-slate-900 resize-none"
							rows={3}
							placeholder="Description of the project. Be as detailed as you'd like."
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Target Market
						</label>
						<input
							type="text"
							value={targetMarket}
							onChange={(e) => setTargetMarket(e.target.value)}
							className="w-full rounded-md border px-3 py-2 bg-white text-slate-900"
							placeholder="e.g. SMBs, Developers, Enterprise"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Status
						</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full rounded-md border px-3 py-2 bg-white text-slate-900"
						>
							<option value="idea">Idea</option>
							<option value="development">Development</option>
							<option value="launched">Launched</option>
						</select>
					</div>

					{error && <p className="text-sm text-rose-600">{error}</p>}

					<DialogFooter>
						<DialogClose>
							<div
								type="button"
								className="px-4 py-2 rounded-md border bg-white"
							>
								Cancel
							</div>
						</DialogClose>

						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
						>
							{loading ? "Creating..." : "Create Project"}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
