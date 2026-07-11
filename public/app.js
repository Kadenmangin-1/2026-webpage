let members = [];

document.addEventListener("DOMContentLoaded", function () {
    loadMembers();
});

async function loadMembers() {
    try {
        const response = await fetch("/shopper");
        const data = await response.json();
        members = Array.isArray(data) ? data : [];
        displayMembers();
    } catch (error) {
        console.log("Could not load members from database:", error);

        const saved = localStorage.getItem("psuFans");
        if (saved) {
            members = JSON.parse(saved);
        }

        displayMembers();
    }
}

document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let age = document.getElementById("age").value.trim();
    let address = document.getElementById("address").value.trim();

    if (fullName === "" || email === "" || age === "" || address === "") {
        alert("Please fill in all required fields.");
        return;
    }

    if (isNaN(age) || age <= 0) {
        alert("Please enter a valid age.");
        return;
    }

    let editIndex = document.getElementById("editIndex").value;

    let member = {
        fullName: fullName,
        email: email,
        phone: phone,
        age: Number(age),
        address: address
    };

    try {
        if (editIndex !== "-1") {
            const memberId = members[editIndex]._id;

            const response = await fetch(`/shopper/${memberId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(member)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Error updating member");
            }

            document.getElementById("editIndex").value = -1;
            document.getElementById("submitBtn").innerText = "Sign Up";
            alert(result.message);
        } else {
            const response = await fetch("/shopper", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(member)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Error saving member");
            }

            alert(result.message);
        }

        localStorage.setItem("psuFans", JSON.stringify(members));
        document.getElementById("signupForm").reset();
        await loadMembers();
    } catch (error) {
        console.error(error);
        alert(error.message || "Could not save member.");
    }
});

function displayMembers() {
    let tableBody = document.getElementById("membersTableBody");
    let jsonOutput = document.getElementById("jsonOutput");
    let countBadge = document.getElementById("memberCount");

    tableBody.innerHTML = "";
    countBadge.innerText = members.length;

    if (members.length === 0) {
        document.getElementById("emptyState").classList.remove("d-none");
        document.getElementById("membersTableWrapper").classList.add("d-none");
    } else {
        document.getElementById("emptyState").classList.add("d-none");
        document.getElementById("membersTableWrapper").classList.remove("d-none");
    }

    for (let i = 0; i < members.length; i++) {
        let row = `
            <tr>
                <td>${i + 1}</td>
                <td>${members[i].fullName}</td>
                <td>${members[i].email}</td>
                <td>${members[i].phone || "-"}</td>
                <td>${members[i].age}</td>
                <td>${members[i].address}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editMember(${i})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMember(${i})">Delete</button>
                </td>
            </tr>
        `;

        tableBody.innerHTML += row;
    }

    jsonOutput.innerText = JSON.stringify(members, null, 2);
}

function editMember(index) {
    document.getElementById("fullName").value = members[index].fullName;
    document.getElementById("email").value = members[index].email;
    document.getElementById("phone").value = members[index].phone || "";
    document.getElementById("age").value = members[index].age;
    document.getElementById("address").value = members[index].address;

    document.getElementById("editIndex").value = index;
    document.getElementById("submitBtn").innerText = "Update";
}

async function deleteMember(index) {
    if (confirm("Are you sure you want to delete this member?")) {
        try {
            const memberId = members[index]._id;

            const response = await fetch(`/shopper/${memberId}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Error deleting member");
            }

            localStorage.setItem("psuFans", JSON.stringify(members));
            alert(result.message);
            await loadMembers();
        } catch (error) {
            console.error(error);
            alert(error.message || "Could not delete member.");
        }
    }
}