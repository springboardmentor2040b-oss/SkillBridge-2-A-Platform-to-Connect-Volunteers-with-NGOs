# ngo.py - NGO Team Management Routes
from fastapi import APIRouter, HTTPException, Depends, Query
from database import users_collection, ngos_collection
from routes.user import get_current_user
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel, EmailStr

router = APIRouter()

# ============================================
# SCHEMAS
# ============================================

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str  # "admin" or "member"

class MemberResponse(BaseModel):
    id: str
    name: str
    email: str
    role_in_ngo: str
    role: str

class NGOMembersResponse(BaseModel):
    ngo_id: str
    ngo_name: str
    owner_email: str
    members: List[MemberResponse]
    member_count: int

# ============================================
# INVITE MEMBER TO NGO
# ============================================
@router.post("/invite")
async def invite_member(
    request: InviteMemberRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Invite a new member to the NGO.
    Only NGO owner/admin can invite.
    User must already exist in the system.
    """
    
    # Must have NGO
    if not current_user.get("ngo_id"):
        raise HTTPException(status_code=403, detail="Only NGO members can invite users")
    
    # Only owner can invite (for now, admins later if needed)
    if current_user.get("role_in_ngo") != "owner":
        raise HTTPException(status_code=403, detail="Only NGO owner can invite members")
    
    # Validate role
    if request.role not in ["admin", "member"]:
        raise HTTPException(status_code=400, detail="Role must be 'admin' or 'member'")
    
    # Find user by email
    target_user = await users_collection.find_one({"email": request.email})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found. They must register first.")
    
    # User must be a volunteer (not already part of another NGO)
    if target_user.get("role") != "volunteer":
        raise HTTPException(status_code=400, detail="Only volunteers can be invited to NGOs")
    
    if target_user.get("ngo_id"):
        raise HTTPException(status_code=400, detail="User is already part of an NGO")
    
    # Update user with ngo_id and role_in_ngo
    ngo_id = current_user.get("ngo_id")
    result = await users_collection.update_one(
        {"_id": target_user["_id"]},
        {"$set": {
            "ngo_id": ngo_id,
            "role_in_ngo": request.role
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to invite user")
    
    return {
        "success": True,
        "message": f"User {request.email} invited as {request.role}",
        "user_id": str(target_user["_id"]),
        "ngo_id": ngo_id,
        "role_in_ngo": request.role
    }

# ============================================
# GET NGO MEMBERS
# ============================================
@router.get("/members", response_model=NGOMembersResponse)
async def get_ngo_members(current_user: dict = Depends(get_current_user)):
    """
    Get all members of the NGO.
    Only NGO members can view their team.
    """
    
    ngo_id = current_user.get("ngo_id")
    if not ngo_id:
        raise HTTPException(status_code=403, detail="User is not part of any NGO")
    
    # Get NGO info
    ngo = await ngos_collection.find_one({"_id": ObjectId(ngo_id)})
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    # Get all members
    cursor = users_collection.find(
        {"ngo_id": ngo_id},
        {"password": 0}
    ).sort("role_in_ngo", -1)  # owner first
    
    members = []
    async for member in cursor:
        members.append(MemberResponse(
            id=str(member["_id"]),
            name=member.get("name"),
            email=member.get("email"),
            role_in_ngo=member.get("role_in_ngo", "member"),
            role=member.get("role")
        ))
    
    return NGOMembersResponse(
        ngo_id=ngo_id,
        ngo_name=ngo.get("name"),
        owner_email=ngo.get("owner_email"),
        members=members,
        member_count=len(members)
    )

# ============================================
# UPDATE MEMBER ROLE
# ============================================
@router.put("/member/{user_id}")
async def update_member_role(
    user_id: str,
    role: str = Query(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a member's role within the NGO.
    Only NGO owner can change roles.
    """
    
    ngo_id = current_user.get("ngo_id")
    if not ngo_id:
        raise HTTPException(status_code=403, detail="User is not part of any NGO")
    
    # Only owner can change roles
    if current_user.get("role_in_ngo") != "owner":
        raise HTTPException(status_code=403, detail="Only NGO owner can change member roles")
    
    # Validate role
    if role not in ["admin", "member"]:
        raise HTTPException(status_code=400, detail="Role must be 'admin' or 'member'")
    
    # Cannot change role of owner
    target_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user.get("role_in_ngo") == "owner":
        raise HTTPException(status_code=400, detail="Cannot change owner's role")
    
    # User must be in same NGO
    if target_user.get("ngo_id") != ngo_id:
        raise HTTPException(status_code=403, detail="User is not part of this NGO")
    
    # Update role
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role_in_ngo": role}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update member role")
    
    return {
        "success": True,
        "message": f"User role updated to {role}",
        "user_id": user_id,
        "role_in_ngo": role
    }

# ============================================
# REMOVE MEMBER FROM NGO
# ============================================
@router.delete("/member/{user_id}")
async def remove_member(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Remove a member from the NGO.
    Only NGO owner can remove members.
    """
    
    ngo_id = current_user.get("ngo_id")
    if not ngo_id:
        raise HTTPException(status_code=403, detail="User is not part of any NGO")
    
    # Only owner can remove members
    if current_user.get("role_in_ngo") != "owner":
        raise HTTPException(status_code=403, detail="Only NGO owner can remove members")
    
    # Find target user
    target_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # User must be in same NGO
    if target_user.get("ngo_id") != ngo_id:
        raise HTTPException(status_code=403, detail="User is not part of this NGO")
    
    # Cannot remove owner
    if target_user.get("role_in_ngo") == "owner":
        raise HTTPException(status_code=400, detail="Cannot remove NGO owner")
    
    # Remove user from NGO
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "ngo_id": None,
            "role_in_ngo": None
        }}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to remove member")
    
    return {
        "success": True,
        "message": f"User removed from NGO",
        "user_id": user_id
    }

# ============================================
# GET NGO INFO
# ============================================
@router.get("/info")
async def get_ngo_info(current_user: dict = Depends(get_current_user)):
    """
    Get current NGO information.
    """
    
    ngo_id = current_user.get("ngo_id")
    if not ngo_id:
        raise HTTPException(status_code=403, detail="User is not part of any NGO")
    
    ngo = await ngos_collection.find_one({"_id": ObjectId(ngo_id)})
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    
    return {
        "id": str(ngo["_id"]),
        "name": ngo.get("name"),
        "owner_email": ngo.get("owner_email"),
        "created_at": ngo.get("created_at"),
        "user_role": current_user.get("role_in_ngo")
    }
