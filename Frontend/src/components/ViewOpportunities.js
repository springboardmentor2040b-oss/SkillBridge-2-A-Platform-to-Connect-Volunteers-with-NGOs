import React, { useEffect, useState } from "react";

function ViewOpportunities() {

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

const [opportunities, setOpportunities] = useState([]);
const [appliedIds, setAppliedIds] = useState([]);
const [loadingApplyId, setLoadingApplyId] = useState(null);
const [applications, setApplications] = useState({});

const [search, setSearch] = useState("");
const [locationFilter, setLocationFilter] = useState("");

const [editData, setEditData] = useState(null);
const [editForm, setEditForm] = useState({
title: "",
description: "",
location: "",
duration: "",
required_skills: ""
});

/* FETCH OPPORTUNITIES */

const fetchOpportunities = () => {

fetch("http://localhost:5000/api/opportunities")
.then(res => res.json())
.then(data => setOpportunities(data))
.catch(err => console.log(err));

};

useEffect(() => {
fetchOpportunities();
}, []);

/* FETCH VOLUNTEER APPLICATIONS */

useEffect(() => {

if (!user || user.role !== "volunteer") return;

fetch(`http://localhost:5000/api/applications/user/${user._id}`)
.then(res => res.json())
.then(data => {

const ids = data.map(app => app.opportunityId);
setAppliedIds(ids);

})
.catch(err => console.log(err));

}, [user]);

/* FETCH NGO APPLICATIONS */

useEffect(() => {

if (!user || user.role !== "ngo") return;

const fetchApplications = async () => {

let apps = {};

for (let opp of opportunities) {

try {

const res = await fetch(`http://localhost:5000/api/applications/opportunity/${opp._id}`);

const data = await res.json();

apps[opp._id] = data;

} catch (err) {
console.log(err);
}

}

setApplications(apps);

};

if(opportunities.length > 0){
fetchApplications();
}

}, [opportunities]);

/* APPLY */
const handleApply = async (opp) => {

setLoadingApplyId(opp._id);

try {

const res = await fetch(
"http://localhost:5000/api/applications/apply",
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
volunteerId: user._id,
opportunityId: opp._id,
ngoId: opp.ngo_id
})
}
);

const data = await res.json();

alert(data.message || "Application submitted successfully");

if (data.message === "Application submitted successfully") {
setAppliedIds(prev => [...prev, opp._id]);
}

} catch (error) {
console.log(error);
}

setLoadingApplyId(null);

};

/* ACCEPT OR REJECT */

const updateStatus = async (applicationId, status, opportunityId) => {

try {

await fetch(
`http://localhost:5000/api/applications/update-status/${applicationId}`,
{
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ status })
}
);

setApplications(prev => ({
...prev,
[opportunityId]: prev[opportunityId].map(app =>
app._id === applicationId
? { ...app, status }
: app
)
}));

} catch (error) {
console.log(error);
}

};

/* DELETE */

const handleDelete = async (id) => {

const confirmDelete = window.confirm("Delete this opportunity?");
if (!confirmDelete) return;

try {

const res = await fetch(`http://localhost:5000/api/opportunities/${id}`, {
method: "DELETE"
});

if(res.ok){
setOpportunities(prev => prev.filter(op => op._id !== id));
alert("Opportunity deleted successfully");
}

} catch (error) {
console.log(error);
}

};

/* EDIT */

const handleEdit = (opp) => {

setEditData(opp);

setEditForm({
title: opp.title,
description: opp.description,
location: opp.location,
duration: opp.duration,
required_skills: Array.isArray(opp.required_skills)
? opp.required_skills.join(", ")
: ""
});

};

const handleEditChange = (e) => {

setEditForm({
...editForm,
[e.target.name]: e.target.value
});

};

/* UPDATE */

const handleUpdateSubmit = async () => {

try {

const res = await fetch(
`http://localhost:5000/api/opportunities/${editData._id}`,
{
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
...editForm,
required_skills: editForm.required_skills.split(",").map(s => s.trim())
})
}
);

const updated = await res.json();

setOpportunities(prev =>
prev.map(o =>
o._id === updated._id ? updated : o
)
);

alert("Opportunity updated successfully");

setEditData(null);

} catch (error) {
console.log(error);
}

};

return (

<div className="p-8 bg-gray-50 min-h-screen">

<h2 className="text-2xl font-bold mb-6 text-gray-800">
All Opportunities
</h2>

<input
type="text"
placeholder="Search opportunities..."
className="border p-3 mb-4 w-full rounded-lg shadow-sm"
value={search}
onChange={(e) => setSearch(e.target.value)}
/>

<select
className="border p-3 mb-6 rounded-lg shadow-sm"
value={locationFilter}
onChange={(e) => setLocationFilter(e.target.value)}
>

<option value="">All Locations</option>
<option value="Remote">Remote</option>
<option value="Pune">Pune</option>
<option value="Mumbai">Mumbai</option>

</select>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{opportunities
.filter((opp) =>
(opp.title || "").toLowerCase().includes(search.toLowerCase()) &&
(locationFilter === "" || opp.location === locationFilter)
)
.map((opp) => (

<div
key={opp._id}
className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
>

<h3 className="text-lg font-semibold text-gray-800">
{opp.title}
</h3>

<p className="text-sm text-gray-500 mb-3">
{opp.description}
</p>

<p className="text-sm text-gray-600">
📍 {opp.location}
</p>

<p className="text-sm text-gray-600 mb-3">
⏳ {opp.duration}
</p>

<div className="flex flex-wrap gap-2 mb-4">

{Array.isArray(opp.required_skills) &&
opp.required_skills.map((skill, i) => (

<span
key={i}
className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
>
{skill}
</span>

))}

</div>

{user && user.role === "volunteer" && (

<button
onClick={() => handleApply(opp)}
disabled={appliedIds.includes(opp._id)}
className={`w-full py-2 rounded-lg font-medium ${
appliedIds.includes(opp._id)
? "bg-yellow-100 text-yellow-700"
: "bg-blue-500 hover:bg-blue-600 text-white"
}`}
>

{appliedIds.includes(opp._id)
? "Application Pending"
: loadingApplyId === opp._id
? "Applying..."
: "Apply"}

</button>

)}

{user && user.role === "ngo" && (

<div>

<div className="flex gap-3 mt-3">

<button
onClick={() => handleEdit(opp)}
className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded-lg"
>
Update
</button>

<button
onClick={() => handleDelete(opp._id)}
className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg"
>
Delete
</button>

</div>

<div className="mt-4">

<h4 className="text-sm font-semibold mb-2">
Volunteer Applications
</h4>

{applications[opp._id]?.map(app => (

<div
key={app._id}
className="flex justify-between items-center mb-2"
>

<span className="text-sm">
{app.volunteerName || "Volunteer"}
</span>

{app.status === "Pending" ? (

<div className="flex gap-2">

<button
onClick={() => updateStatus(app._id,"Accepted",opp._id)}
className="bg-green-500 text-white px-2 py-1 text-xs rounded"
>
Accept
</button>

<button
onClick={() => updateStatus(app._id,"Rejected",opp._id)}
className="bg-red-500 text-white px-2 py-1 text-xs rounded"
>
Reject
</button>

</div>

) : (

<span className="text-xs text-gray-600">
{app.status}
</span>

)}

</div>

))}

</div>

</div>

)}

</div>

))}

</div>

{/* UPDATE MODAL */}

{editData && (

<div className="fixed inset-0 flex justify-center items-center z-50">

<div
className="absolute inset-0 bg-black bg-opacity-40"
onClick={() => setEditData(null)}
></div>

<div className="bg-white p-6 rounded shadow w-96 relative z-10">

<h2 className="text-xl font-bold mb-4">
Update Opportunity
</h2>

<input
type="text"
name="title"
value={editForm.title}
onChange={handleEditChange}
className="border p-2 mb-2 w-full"
/>

<textarea
name="description"
value={editForm.description}
onChange={handleEditChange}
className="border p-2 mb-2 w-full"
/>

<input
type="text"
name="location"
value={editForm.location}
onChange={handleEditChange}
className="border p-2 mb-2 w-full"
/>

<select
name="duration"
value={editForm.duration}
onChange={handleEditChange}
className="border p-2 mb-2 w-full"
>

<option value="">Select Duration</option>
<option value="1 Week">1 Week</option>
<option value="2 Weeks">2 Weeks</option>
<option value="1 Month">1 Month</option>
<option value="3 Months">3 Months</option>
<option value="6 Months">6 Months</option>

</select>

<input
type="text"
name="required_skills"
value={editForm.required_skills}
onChange={handleEditChange}
className="border p-2 mb-3 w-full"
/>

<div className="flex justify-between">

<button
onClick={handleUpdateSubmit}
className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
>
Update
</button>

<button
onClick={() => setEditData(null)}
className="bg-gray-500 text-white px-3 py-1 rounded"
>
Cancel
</button>

</div>

</div>

</div>

)}

</div>

);

}

export default ViewOpportunities;