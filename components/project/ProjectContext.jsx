"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProjectContext({ project }) {
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [description, setDescription] = useState("");
	// customPairs is an array of { key, value }
	const [customPairs, setCustomPairs] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (project) {
			setDescription(
				project.long_description || project.description || ""
			);
			// normalise stored custom_context to array of {key,value}
			try {
				const ctx = project.custom_context;
				if (!ctx) {
					setCustomPairs([]);
				} else if (Array.isArray(ctx)) {
					setCustomPairs(
						ctx.map((item) => ({
							key: item.key ?? "",
							value: item.value ?? "",
						}))
					);
				} else if (typeof ctx === "object") {
					// if stored as object, convert to pairs
					setCustomPairs(
						Object.entries(ctx).map(([k, v]) => ({
							key: k,
							value: v,
						}))
					);
				} else {
					setCustomPairs([]);
				}
			} catch (e) {
				setCustomPairs([]);
			}
		}
	}, [project]);

	if (!project) {
		return (
			<div className="p-8">
				<p className="text-slate-600">No project selected.</p>
			</div>
		);
	}

	const handleAddPair = () => {
		setCustomPairs((p) => [...p, { key: "", value: "" }]);
	};

	const handleRemovePair = (index) => {
		setCustomPairs((p) => p.filter((_, i) => i !== index));
	};

	const handlePairChange = (index, field, value) => {
		setCustomPairs((p) =>
			p.map((row, i) => (i === index ? { ...row, [field]: value } : row))
		);
	};

	const handleSave = async () => {
		setSaving(true);
		setError(null);

		// prepare payload: save as array of {key,value} filtering empty keys
		const payload = customPairs
			.map((r) => ({ key: (r.key || "").trim(), value: r.value ?? "" }))
			.filter((r) => r.key.length > 0);

		try {
			const { data, error: upErr } = await supabase
				.from("projects")
				.update({
					custom_context: payload,
					description: description,
				})
				.eq("id", project.id)
				.select("*")
				.single();

			if (upErr) {
				setError(upErr.message || "Failed to save");
			} else {
				// update local state from returned data
				setDescription(data.long_description || data.description || "");
				setCustomPairs(
					Array.isArray(data.custom_context)
						? data.custom_context
						: []
				);
				setEditing(false);
			}
		} catch (e) {
			setError(e.message || String(e));
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="w-full max-w-4xl px-4">
			<Card className="w-full max-w-5xl mx-auto">
				<CardContent className="p-8">
					<header className="mb-8 flex items-start justify-between gap-4">
						<div className="w-full">
							<h1 className="text-3xl font-bold mb-2">
								{project.name}
							</h1>
							{!editing ? (
								<p className="text-sm text-slate-500">
									{description || "No description provided."}
								</p>
							) : (
								<textarea
									className="w-full text-sm text-slate-700 p-2 border rounded-md resize-none"
									rows={3}
									value={description}
									onChange={(e) => {
										setDescription(e.target.value);
										// update element height
										e.target.style.height = "auto";
										e.target.style.height = `${e.target.scrollHeight}px`;
									}}
									placeholder="Project description"
								/>
							)}
						</div>

						<div className="flex items-center gap-2">
							{!editing ? (
								<Button
									size="sm"
									onClick={() => setEditing(true)}
								>
									Edit
								</Button>
							) : (
								<>
									<Button
										size="sm"
										onClick={handleSave}
										disabled={saving}
									>
										{saving ? "Saving..." : "Save"}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											// revert local state
											setEditing(false);
											setError(null);
											setDescription(
												project.long_description ||
													project.description ||
													""
											);
											try {
												const ctx =
													project.custom_context;
												if (!ctx) setCustomPairs([]);
												else if (Array.isArray(ctx))
													setCustomPairs(
														ctx.map((item) => ({
															key: item.key ?? "",
															value:
																item.value ??
																"",
														}))
													);
												else if (
													typeof ctx === "object"
												)
													setCustomPairs(
														Object.entries(ctx).map(
															([k, v]) => ({
																key: k,
																value: v,
															})
														)
													);
											} catch (e) {
												setCustomPairs([]);
											}
										}}
									>
										Cancel
									</Button>
								</>
							)}
						</div>
					</header>

					<section className="mb-6">
						<h2 className="text-sm text-slate-500 uppercase tracking-wider mb-2">
							Status
						</h2>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
							{project.status || "unknown"}
						</div>
					</section>

					<section className="prose max-w-none">
						<div className="mt-6">
							<h4 className="text-sm text-slate-500 mb-2">
								Custom context
							</h4>

							{!editing &&
								(!customPairs || customPairs.length === 0) && (
									<p className="text-sm text-slate-600">
										No custom context added.
									</p>
								)}

							{!editing &&
								customPairs &&
								customPairs.length > 0 && (
									<div className="space-y-6">
										{customPairs.map((p, idx) => (
											<div
												key={idx}
												className="border rounded-md p-4 bg-slate-50"
											>
												<div className="font-semibold text-slate-800 text-lg">
													{p.key}
												</div>
												<Separator className="my-2" />
												<div
													className="text-sm text-slate-700"
													style={{
														whiteSpace: "pre-wrap",
													}}
												>
													{p.value}
												</div>
											</div>
										))}
									</div>
								)}

							{editing && (
								<div className="space-y-3">
									{customPairs.map((pair, idx) => (
										<div
											key={idx}
											className="flex flex-col gap-2 items-stretch"
										>
											<div className="flex items-center gap-2">
												<Input
													className="flex-1"
													placeholder="Title (e.g. design palette info)"
													value={pair.key}
													onChange={(e) =>
														handlePairChange(
															idx,
															"key",
															e.target.value
														)
													}
												/>
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleRemovePair(idx)
													}
													type="button"
												>
													Remove
												</Button>
											</div>
											<textarea
												className="w-full p-3 border rounded-md resize-y min-h-[120px]"
												placeholder="Enter detailed context here..."
												value={pair.value}
												onChange={(e) =>
													handlePairChange(
														idx,
														"value",
														e.target.value
													)
												}
												rows={6}
											/>
										</div>
									))}

									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={handleAddPair}
											type="button"
										>
											Add custom context
										</Button>
										{error && (
											<div className="text-sm text-red-600">
												{error}
											</div>
										)}
									</div>
								</div>
							)}

							<div className="mt-6">
								<h4 className="text-sm text-slate-500 mb-2">
									Meta
								</h4>
								<ul className="text-sm text-slate-600">
									<li>
										Created:{" "}
										{project.created_at
											? new Date(
													project.created_at
											  ).toLocaleString()
											: "-"}
									</li>
									<li>
										Updated:{" "}
										{project.updated_at
											? new Date(
													project.updated_at
											  ).toLocaleString()
											: "-"}
									</li>
								</ul>
							</div>
						</div>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}
